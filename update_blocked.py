import requests
import subprocess
import sys
import os
import time
import signal
#url del servidor que hsotea las paginas bloqueadas
URL = "https://bac8be0b-a612-4943-a25f-81b9a30c987e-00-1f69n0mvga52z.janeway.replit.dev/"
OUTPUT_FILE = "/etc/squid/blocked.txt"
INTERVAL_SECONDS = 60  # Espera de 1 minuto entre comprobaciones
running = True

def fetch_remote_data():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        print(f"[!] Error al descargar la lista: {e}")
        return None

def read_local_file(path):
    if not os.path.exists(path):
        return None
    with open(path, "rb") as f:
        return f.read()

def write_file(path, data):
    with open(path, "wb") as f:
        f.write(data)

def restart_squid():
    try:
        subprocess.run(["systemctl", "restart", "squid"], check=True)
        print("[✓] Servicio squid reiniciado.")
    except subprocess.CalledProcessError as e:
        print(f"[!] Error al reiniciar squid: {e}")

def handle_exit(signum, frame):
    global running
    print("\n[!] Señal de interrupción recibida. Saliendo...")
    running = False

def main_loop():
    print("[✓] Iniciando monitor de lista bloqueada. Ctrl+C para salir.")

    while running:
        remote_data = fetch_remote_data()
        if remote_data is None:
            print("[!] Saltando esta iteración por error de descarga.")
        else:
            local_data = read_local_file(OUTPUT_FILE)
            if remote_data != local_data:
                print("[+] Cambio detectado. Actualizando archivo y reiniciando squid.")
                write_file(OUTPUT_FILE, remote_data)
                restart_squid()
            else:
                print("[-] Sin cambios. Esperando el próximo ciclo...")

        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    if os.geteuid() != 0:
        print("Este script debe ejecutarse como root. Usa sudo.")
        sys.exit(1)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    main_loop()
