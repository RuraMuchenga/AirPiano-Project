
import serial
import time
import socketio
import requests 

sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print('Connected to server')

@sio.on('disconnect')
def on_disconnect():
    print('Disconnected from server')

@sio.on('connect_error')
def on_connect_error(exception):
    print(f'Connection failed: {exception}')

def send_distance_data(distance):
    sio.emit('distanceData', {'distance': distance})

    
    if distance < 35:
        thingspeak_url = 'https://api.thingspeak.com/update'
        api_key = 'JZXPT9QOHKAH9G6E' 
        field1 = distance

        try:
            response = requests.get(f"{thingspeak_url}?api_key={api_key}&field1={field1}")
            print(f'ThingSpeak Response: {response.text}')
        except Exception as e:
            print(f"Error sending data to ThingSpeak: {e}")

        
        if distance < 10:
            print("Distance is less than 10 cm. Play high-pitched music.")
           
        else:
            print("Distance is less than 35 cm but greater than 10 cm. Play medium-pitched music.")
            

serial_port = "COM3"
baud_rate = 9600

try:
    ser = serial.Serial(serial_port, baud_rate, timeout=1)
    sio.connect('http://localhost:3004')

    while True:
        line = ser.readline().decode("utf-8").strip()

        if line.startswith("Distance:"):
            distance_str = line.split(" ")[1]
            distance = float(distance_str)
            print(f"Distance: {distance} cm")

            send_distance_data(distance)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Exiting the program.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    if locals().get('ser') and ser.is_open:
        ser.close()
    sio.disconnect()
