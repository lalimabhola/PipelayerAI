# Summer Martin, Lalima Bhola, Dom Lamastra
# CSC 380 Pipelayer Project

import matplotlib.pyplot as plt
import numpy as np

class Game:

  def __init__(self, winner, round, t):
    
    self.winner = winner
    self.round = round
    self.t = t

player_choices = ["squares", "circles"]
samples = []
sample_t = []

#  open file
data = open("resultsHvH.txt", "r")

# variables
overall_count = 0
circle_count = 0
square_count = 0

moves1 = 0
moves2 = 0
moves3 = 0
moves4 = 0
moves5 = 0
totalMoves = 0

time1 = 0
time2 = 0
time3 = 0
time4 = 0
time5 = 0
time6 = 0
time7 = 0
totalTime = 0

# go through file
for line in data:
  temp = line.split()
  temp[1] = np.int8(temp[1])
  temp[2] = np.int8(temp[2])
  
  # count number of wins for each agent
  if (temp[0] == ("circles")):
    circle_count+=1
  else:
    square_count+=1

  # count range of number of moves for each game - used to make percentages
  if (temp[1] < 25):
    moves1+=1
  elif(temp[1] > 25 and temp[1] <= 29):
    moves2+=1
  elif(temp[1] >= 30 and temp[1] <= 34):
    moves3+=1
  elif(temp[1] >= 35 and temp[1] <= 39):
    moves4+=1
  else:
    moves5+=1
  
  # count range of time for each game - used for percentages
  if (temp[2] < 60):
    time1+=1
  elif(temp[2] >= 60 and temp[2] <= 69):
    time2+=1
  elif(temp[2] >= 70 and temp[2] <= 79):
    time3+=1
  elif(temp[2] >= 80 and temp[2] <= 89):
    time4+=1
  elif(temp[2] >= 90 and temp[2] <= 99):
    time5+=1
  elif(temp[2] >= 100 and temp[2] <= 109):
    time6+=1
  else:
    time7+=1

  totalMoves += temp[1]
  totalTime += temp[2]

  overall_count+=1

data.close()

# generate graph data
data2 = open("samplesResultsHvH.txt")
for line in data2:
  line = line.strip()
  temp = line.split()
  samples.append(np.int16(temp[0]))
  sample_t.append(np.int16(temp[1]))
data2.close()
my_bins = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]

# print statistics
print("\nStatistics for Heuristic vs Heuristic Game\n")
print((moves1/overall_count) * 100, " percent of games took 20 - 24 moves\n")
print((moves2/overall_count) * 100, " percent of games took 25 - 29 moves\n")
print((moves3/overall_count) * 100, " percent of games took 30 - 34 moves\n")
print((moves4/overall_count) * 100, " percent of games took 35 - 39 moves\n")
print((moves5/overall_count) * 100, " percent of games took >= 40 moves\n\n")
print((totalMoves/overall_count), " moves is the Average number of moves\n\n")
print((time1/overall_count) * 100, " percent of games took <60 seconds\n")
print((time2/overall_count) * 100, " percent of games took 60 - 69 seconds\n")
print((time3/overall_count) * 100, " percent of games took 70 - 79 seconds\n")
print((time4/overall_count) * 100, " percent of games took 80 - 89 seconds\n")
print((time5/overall_count) * 100, " percent of games took 90 - 99 seconds\n")
print((time6/overall_count) * 100, " percent of games took 100 - 109 seconds\n")
print((time7/overall_count) * 100, " percent of games took >110 seconds\n\n")
print((totalTime/overall_count), " seconds is the Average amount of time\n\n")

# make graph
sample_times = plt.figure(1).add_subplot()
sample_times.bar(sample_t, samples)
sample_times.set_xlabel('Number of Samples used in Simulation')
sample_times.set_ylabel('Round of Game')
sample_times.set_title('Number of Samples in Round of Game')

plt.show()


#########

# open file
data3 = open("resultsRvH.txt", "r")

# variables
samples2 = []
sample_t2 = []

overall_count = 0
circle_count = 0
square_count = 0

moves1 = 0
moves2 = 0
moves3 = 0
moves4 = 0
moves5 = 0
moves6 = 0
totalMoves = 0

time1 = 0
time2 = 0
time3 = 0
totalTime = 0

# go through file
for line in data3:
  temp = line.split()
  temp[1] = np.int8(temp[1])
  temp[2] = np.int8(temp[2])

  # count number of wins for each agent
  if (temp[0] == ("circles")):
    circle_count+=1
  else:
    square_count+=1

  # count range of number of moves for each game - used to make percentages
  if (temp[1] == 10):
    moves1+=1
  elif(temp[1] == 12):
    moves2+=1
  elif(temp[1] == 14):
    moves3+=1
  elif(temp[1] == 16):
    moves4+=1
  elif(temp[1] == 18):
    moves5+=1
  else:
    moves6+=1
  
  # count range of time for each game - used for percentages
  if (temp[2] <= 15):
    time1+=1
  elif(temp[2] >= 16 and temp[2] <= 20):
    time2+=1
  else:
    time3+=1

  totalMoves += temp[1]
  totalTime += temp[2]
  overall_count+=1

data3.close()

# generate graph data
data4 = open("samplesResultsRvH.txt")
for line in data4:
  line = line.strip()
  temp = line.split()
  samples2.append(np.int16(temp[0]))
  sample_t2.append(np.int16(temp[1]))
data4.close()
my_bins = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]

# print statistics
print("\nStatistics for Random vs Heuristic Game\n")
print((moves1/overall_count) * 100, " percent of games took 10 moves\n")
print((moves2/overall_count) * 100, " percent of games took 12 moves\n")
print((moves3/overall_count) * 100, " percent of games took 14 moves\n")
print((moves4/overall_count) * 100, " percent of games took 16 moves\n")
print((moves5/overall_count) * 100, " percent of games took 18 moves\n")
print((moves6/overall_count) * 100, " percent of games took >20 moves\n\n")
print((totalMoves/overall_count), " moves is the Average number of moves\n\n")
print((time1/overall_count) * 100, " percent of games took <=15 seconds\n")
print((time2/overall_count) * 100, " percent of games took 16 - 20 seconds\n")
print((time3/overall_count) * 100, " percent of games took >20 seconds\n\n")
print((totalTime/overall_count), " seconds is the Average amount of time\n\n")

# make graph
sample_times2 = plt.figure(2).add_subplot()
sample_times2.bar(sample_t, samples)
sample_times2.set_xlabel('Number of Samples used in Simulation')
sample_times2.set_ylabel('Round of Game')
sample_times2.set_title('Number of Samples in Round of Game')

plt.show()