#!/bin/bash

# Salir si ocurre cualquier error
set -e

echo "🔄 Actualizando paquetes..."
sudo apt update && sudo apt upgrade -y

echo "📦 Instalando Squid..."
sudo apt install -y squid

echo "🐍 Instalando Python 3..."
sudo apt install -y python3 python3-pip

echo "🛠️ Configurando Squid..."

# Crear archivo de configuración
sudo tee /etc/squid/squid.conf > /dev/null <<EOF
#
# Configuración mínima de Squid para proxy con bloqueo
#

# Redes locales permitidas (ajusta si tu red es diferente)
acl localnet src 10.0.0.0/8
acl localnet src 172.16.0.0/12
acl localnet src 192.168.0.0/16

# Puertos seguros
acl SSL_ports port 443
acl Safe_ports port 80          # http
acl Safe_ports port 21          # ftp
acl Safe_ports port 443         # https
acl Safe_ports port 1025-65535  # unregistered ports

# Bloquear páginas específicas
acl sitios_bloqueados dstdomain "/etc/squid/blocked.txt"
http_access deny sitios_bloqueados

# Reglas recomendadas de seguridad
http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localhost
http_access allow localnet

# Denegar todo lo demás
http_access deny all

# Puerto donde escucha Squid
http_port 3128

# Directorio de caché
coredump_dir /var/cache/squid

# Patrones de caché (recomendado dejar así)
refresh_pattern ^ftp:           1440    20%     10080
refresh_pattern -i (/cgi-bin/|\?) 0     0%      0
refresh_pattern .               0       20%     4320
EOF

echo "📁 Creando archivo de sitios bloqueados..."
sudo mkdir -p /etc/squid
sudo tee /etc/squid/blocked.txt > /dev/null <<EOF
# Lista de dominios bloqueados
example.com
badwebsite.com
socialmedia.com
EOF

echo "🔄 Reiniciando Squid para aplicar configuración..."
sudo systemctl restart squid

echo "🐍 Ejecutando update_blocked.py..."
sudo python3 /etc/squid/update_blocked.py

echo "✅ Squid ha sido instalado y configurado correctamente."
