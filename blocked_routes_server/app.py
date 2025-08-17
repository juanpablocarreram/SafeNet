import os
import logging
from flask import Flask, Response, request, jsonify
from flask_cors import CORS

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Create the Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")

# Enable CORS for all routes to allow React app to make requests
CORS(app)

# In-memory storage for domains (in production, use a database)
domains = [".facebook.com", ".roblox.com"]

@app.route('/')
def get_domains():
    """
    Returns domain data as plain text for script consumption.
    No HTML, CSS, or formatting - just raw text content.
    """
    domain_data = "\n".join(domains)
    
    # Return as plain text with explicit content type
    return Response(domain_data, mimetype='text/plain')

@app.route('/api/domains', methods=['GET'])
def api_get_domains():
    """
    API endpoint to get all domains as JSON
    """
    return jsonify(domains)

@app.route('/api/domains', methods=['POST'])
def api_add_domain():
    """
    API endpoint to add a new domain
    Expected JSON: {"domain": ".example.com"}
    """
    data = request.get_json()
    
    if not data or 'domain' not in data:
        return jsonify({'error': 'Domain is required'}), 400
    
    domain = data['domain'].strip()
    
    if not domain:
        return jsonify({'error': 'Domain cannot be empty'}), 400
    
    if domain in domains:
        return jsonify({'error': 'Domain already exists'}), 400
    
    domains.append(domain)
    logging.info(f"Added domain: {domain}")
    
    return jsonify({'message': 'Domain added successfully', 'domain': domain}), 201

@app.route('/api/domains', methods=['DELETE'])
def api_remove_domain():
    """
    API endpoint to remove a domain
    Expected JSON: {"domain": ".example.com"}
    """
    data = request.get_json()
    
    if not data or 'domain' not in data:
        return jsonify({'error': 'Domain is required'}), 400
    
    domain = data['domain'].strip()
    
    if domain not in domains:
        return jsonify({'error': 'Domain not found'}), 404
    
    domains.remove(domain)
    logging.info(f"Removed domain: {domain}")
    
    return jsonify({'message': 'Domain removed successfully', 'domain': domain}), 200

if __name__ == '__main__':
    # Run the Flask app on port 5000, binding to all interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)