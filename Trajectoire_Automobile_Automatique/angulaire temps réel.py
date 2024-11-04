import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt
from math import atan
import serial
import serial.tools.list_ports

cap = cv.VideoCapture(0)

if not cap.isOpened():
    print("Cannot open camera")
    exit()

ret0, frame0 = cap.read()
n, m = int(np.shape(frame0)[0]/2),int(np.shape(frame0)[1]/2)

s=170
t=0

T=[]
R=[]

print("Recherche d'un port serie...")

ports = serial.tools.list_ports.comports(include_links=False)

if (len(ports) != 0): # on a trouvé au moins un port actif

    if (len(ports) > 1):     # affichage du nombre de ports trouvés
        print (str(len(ports)) + " ports actifs ont ete trouves:") 
    else:
        print ("1 port actif a ete trouve:")

    ligne = 1

    for port in ports :  # affichage du nom de chaque port
        print(str(ligne) + ' : ' + port.device)
        ligne = ligne + 1


    baud = 9600

    # on établit la communication série


def position_extremites(M,N,mat):
    i=M
    j=M
    while i<2*M and mat[N,i] != 255 :
        i=i+1
    while j>0 and mat[N,j] != 255:
        j=j-1

    return j,i

while True:
    
    ret, frame = cap.read()
    
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break

    #cv.imshow('image', frame)
    
    
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    

    #cv.imshow('gris', gray)

    s, black = cv.threshold(gray, s, 255, cv.THRESH_BINARY)

    cv.imshow('noir et blanc', black)

    #canny = cv.Canny(gray, 150, 175)
    #cv.imshow('canny', canny)


    bas_gauche,bas_droit = position_extremites(m,0,black)
    haut_gauche,haut_droit = position_extremites(m,2*n-1,black)

    
    teta=(atan((haut_gauche-bas_gauche)/(2*n))+atan((haut_droit-bas_droit)/(2*n)))/2
    #print(teta)
    t=t+1
    T.append(t)
    R.append(teta)

    vitesse=int(teta*850)
    print(vitesse)
    
    if vitesse>255 :
        vitesse=255

    if vitesse<-255 :
        vitesse=-255

    message=str(vitesse)
    arr=bytes(message+"\r\n",'ascii')

    arduino = serial.Serial(ports[0].device, baud, timeout=1)
    arduino.write(arr)   # envoi du message série
    arduino.close()
    
    if cv.waitKey(1) == ord('q'):
        break

plt.plot(T,R)
plt.show()
    

cap.release()
cv.destroyAllWindows()
