import numpy as np
from random import randint

A=np.zeros([10,10])
B=np.zeros([10,10])
C=np.zeros([10,10])
D=np.zeros([10,10])
           
def placement (M,x): #M la matrice de jeu, x la taille du bateau
    sens=randint(1,2)
    if sens==1 : #bateaux à l'horizontale, position au hasard sur M
        k=0
        while k!=x :
            k=0
            colonne=randint(0,10-x)
            ligne=randint(0,9)
    
            for c in range (colonne, colonne+x): #vérification qu'il n'y ai pas de bateau déja placé sur cette emplacement
                if M[ligne,c]==0 :
                    k+=1
        
        for c in range (colonne, colonne+x): #écriture dans la matrice
            M[ligne,c]=x
            
        
    if sens==2 : #Idem pour la verticale
        k=0
        while k!=x :
            k=0
            colonne=randint(0,9)
            ligne=randint(0,10-x)
    
            for l in range (ligne, ligne+x):
                if M[l,colonne]==0 :
                    k+=1
        

        for l in range (ligne, ligne+x):
            M[l,colonne]=x       

       
def plateau (M): #fonction de création d'un plateau de jeu
    placement(M,5)
    placement(M,4)
    placement(M,3)
    placement(M,2)


def attaque (M,N):
    print('\n')
    print('choisissez une case à attaquer (entre 1 et 10)')
    ligne=10-int(input('ligne :'))
    colonne=int(input('colonne :'))-1 #modificateurs pour que 1;1 soit en bas à gauche
    print('\n')
    k=M[ligne, colonne]
    if k >0 : #Si bateau présent sur la case attaqué
        p=0
        M[ligne, colonne]=0
        for i in range (10): #Test si c'est la dernière case du bateau attaqué avec p==0 ou p!=0
            for j in range (10):
                if M[i,j]==k :
                    p+=1
        
        if p!=0 :
            N[ligne, colonne]=2
            print(N)
            print('\n')
            print('touché')
        if p==0 :
            N[ligne, colonne]=3
            print(N)
            print('\n')
            print('touché coulé un bateau de taille ', int(k))
        print('\n')
        return True
    
    else : #Si bateau pas présent sur la case attaqué
        N[ligne, colonne]=1
        print(N)
        print('\n')
        print('raté')
        return False

def tour (M,L,N): #Tour d'un joueur avec : Son plateau de jeu, Le plateau de jeu adverse, Le plateau qui récapitule ses attaques
    
    print('\n')
    print('votre plateau :')
    print('\n')
    print(M)
    print('\n')
    print('vos attaques')
    print('\n')
    print(N)
    print('\n')
    X=attaque(L,N)
    print('\n')
    if X==False : #attaque retourne fausse si aucun bateau n'est touché
        input("appuyez sur entrée pour cacher votre plateau avant de tendre l'ordinateur a votre adversaire")
        print('\n'*100)
    return X

#Setup du jeu et explication des règles
plateau(A)
plateau(B)
print('explications : vos bateaux sont représentés par des chiffres entre 2 et 5 en fonction de leur taille. Lorsque vous attaquez, le 2 symbolise le touché, le 1 le manqué et le 3 le coulé.','\n', 'A chaque tour, entrez la ligne et la colonne de la case que vous voulez attaquer (entre 0 et 9)')
print('\n')
input('joueur 1 appuyez sur entrée pour voir votre plateau de jeu')
print('\n')
print(A)
print('\n')
input("appuyez sur entrée pour cacher votre plateau avant de tendre l'ordinateur a votre adversaire")
print('\n'*100)
input('joueur 2 appuyez sur entrée pour voir votre plateau de jeu')
print('\n')
print(B)
print('\n')
input("appuyez sur entrée pour cacher votre plateau avant de tendre l'ordinateur a votre adversaire")
print('\n'*100)

p=14 #2+3+4+5, compteur de cases de bateaux en vie. p ou v = 0 signifie que le jeu est fini
v=14
while p!=0 and v!=0 :

    input('joueur 1 appuyez sur entrée pour voir votre plateau de jeu et attaquer')
    while tour(A,B,D)==True : #Le joueur 1 joue tant qu'il touche ou qu'il coule
        p-=1
        if p==0 :
            break
        input('joueur 1 appuyez sur entrée pour voir votre plateau de jeu et attaquer')
    if p!=0 : #Test pour savoir si le joueur 1 n'a pas gagné auquel cas on ne joue pas le tour du joueur 2
        input('joueur 2 appuyez sur entrée pour voir votre plateau de jeu et attaquer')
        while tour(B,A,C)==True : #Le joueur 2 joue tant qu'il touche ou qu'il coule
            v-=1
            if v==0 :
                break
            input('joueur 2 appuyez sur entrée pour voir votre plateau de jeu et attaquer')

if p==0 :
    print('Bravo, joueur 1 gagne')

if v==0 :
    print('Bravo, joueur 2 gagne')
