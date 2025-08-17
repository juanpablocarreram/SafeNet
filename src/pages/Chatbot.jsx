import "./Chatbot.css"
function Chatbot(){
    return (
        <div className="container">
            <div className="chat-container">
                <div className="chat"></div>
                <div className="prompt-section">
                    <input type="text" className="prompt" placeholder="Dame todas las dudas que tengas relacionadas de tu hijo"/>
                    <button className="submit-prompt" />
                </div>
            </div>
        </div>
    )
}
export default Chatbot