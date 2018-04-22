import word2vec
import sys
#word2vec.word2phrase('/home/jbunie/Downloads/text8', '/home/jbunie/Downloads/text8-phrases', verbose=True)

model = word2vec.load('/home/jbunie/Downloads/text8.bin')
while True:
    posi = raw_input().split(' ')
    negi = raw_input().split(' ')
    if(posi[0]==''):
        posi=[]
    if(negi[0]==''):
        negi=[]
    indexes, metrics = model.analogy(pos=posi, neg=negi, n=10)
    res= model.generate_response(indexes, metrics).tolist()
    print(res)
    sys.stdout.flush()

# print raw_input()
# print raw_input()