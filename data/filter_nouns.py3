nouns_arr = [line.rstrip() for line in open("nounlist.txt", "r")]
glove_arr = [line for line in open("glove.6B.100d.txt", "r")]

out_file = open("glove.6B.100d.nouns-only.txt", "w")
out_arr = []

for line in glove_arr:
  if line.split(" ")[0] in nouns_arr:
    out_arr.append(line)

out_file.writelines(out_arr)
