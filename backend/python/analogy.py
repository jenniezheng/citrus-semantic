import word2vec
import sys
#word2vec.word2phrase('/home/jbunie/Downloads/text8', '/home/jbunie/Downloads/text8-phrases', verbose=True)

model = word2vec.load('/home/jbunie/citrus/data/convertvec/long3.bin')
while True:
    posi = raw_input().split(' ')
    negi = raw_input().split(' ')
    if(posi[0]==''):
        posi=[]
    if(negi[0]==''):
        negi=[]
    try:
        indexes, metrics = model.analogy(pos=posi, neg=negi, n=3)
        res= model.generate_response(indexes, metrics).tolist()
        print(res[0][0]+ " "+res[1][0]+" "+res[2][0])
    except:
        print("fail fail fail")
    sys.stdout.flush()