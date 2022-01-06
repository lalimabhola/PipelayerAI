# Summer Martin, Lalima Bhola, Dom Lamastra
# CSC 380 Pipelayer Project

# importing modules
import collections
import numpy as np
import random
from timeit import default_timer as timer
import time

# object that holds a specific connection on the board between two circles or two squares
class MoveCoords:

  def __init__(self, row, col):
    self.row = row
    self.col = col
    self.score = 0
    
# class that holds boards
class Game:
  def __init__(self, board, level):
    self.board = np.copy(board)
    self.weights = np.copy(board)

# object that holds everything in the stack for determine winners to have
class Stack:
  def __init__(self, board, row, col):
    self.board = np.copy(board)
    self.row = row
    self.col = col
    self.left = False
    self.right = False
    self.down = False
    self.up = False

# Check if there is a duplicate in the array
def find_dup(s, t):
  
  # check in the stack if the row and col are already in the stack. This will happen if we find a cycle in the game board
  for i in range(len(s)):
    if(s[i].row == t.row and s[i].col == t.col):
      s.append(s.pop(i)) # move the node to the end of the stack since we are looking at it again, the directions will be saved

      return True # Found Duplicate
  
  return False # Did not find Duplicate

# The way the board is structured:
  # 0 --> squares
  # 1 --> circles
  # 2 --> space that can be a circle or square
  # -3 --> a vertical line
  # -4 --> a horizontal line
# The way that the game is checked to determine a winner, or if the winner has reached a goal state can be thought of like an agent. Because a
# player can move at any spot on the board at any time the agent has to check the whole board after every move. To determine if an agent can move,
# it checks if it is neigboring a -3 or a -4. If agent can move, it will move and it will mark that it moved that way in a stack. If the agent
# reaches a dead end meaning there are either no available moves or all moves have previously been searched, the agent goes back to where it came
# from before. It will not go back and forth forever because as it goes back it marks that it went back so the move to go forward again at the
# same dead end it was at previously is now unavalibale. If the agent gets to the other side, the game is over.

# To determine if the squares win, the agent starts at row 0, col 1, which is the square in the top left corner, and checks in all directions if it
# can move. If the agent ever goes into the 10th row, the game is over
# To determine if the circles win, the agent starts at row 1, col 0, which is the circle in the top left corner, and checks in all directions if it
# can move. If the agent ever goes into the 10th column, the game is over

# Determines if squares win
def dw_0(stack):

  # if the stack is not empty there are nodes to check. Stack is intialized in main with one node
  while (len(stack) > 0):
    loc = stack[len(stack) - 1] # location for top of stack

    # The user made it to the other side of the board, therefore the squares have won
    if (loc.row == 10):
      return stack
      
    # There exists a possible path in the right direction
    if ((loc.col <= 7) and (loc.board[loc.row][loc.col + 1] == -4) and (loc.right == False)):
      
      loc.right = True # if we ever return to this node, it should not go right again because that has already been checked
      temp = Stack(loc.board, loc.row, loc.col  + (2)) # create node to add to the stack
      temp.left = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue

    # There exists a possible path in the upward direction
    elif ((loc.board[loc.row + 1][loc.col] == -3) and (loc.up == False)):
      
      loc.up = True # if we ever return to this node, it should not go up again because that has already been checked
      temp = Stack(loc.board, loc.row + (2), loc.col) # create node to add to the stack
      temp.down = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue
    
    # There exists a possible path in the downward direction
    elif ((loc.row >= 2) and (loc.board[loc.row - 1][loc.col] == -3) and (loc.down == False)):

      loc.down = True # if we ever return to this node, it should not go down again because that has already been checked
      temp = Stack(loc.board, loc.row - (2), loc.col) # create node to add to the stack
      temp.up = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue

    # There exists a possible path in the left direction
    elif ((loc.col >= 2) and (loc.board[loc.row][loc.col - 1] == -4) and (loc.left == False)):

      loc.left = True # if we ever return to this node, it should not go left again because that has already been checked
      temp = Stack(loc.board, loc.row, loc.col - (2)) # create node to add to the stack
      temp.right = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue

    # we hit a dead end
    else:
      stack.pop() # remove node from stack because there is no possible direction to go in, therefore it is a dead end

  return None

# determines if circles win
def dw_1(stack):

  # if the stack is not empty there are nodes to check. Stack is intialized in main with one node
  while (len(stack) > 0):
    loc = stack[len(stack) - 1] # location for top of stack
    
    # The user made it to the other side of the board, therfore the circles have won
    if (loc.col == 10):
      return stack

     # There exists a possible path in the upward direction
    if ((loc.row <= 7) and (loc.board[loc.row + 1][loc.col] == -3) and (loc.up == False)):
      
      loc.up = True # if we ever return to this node, it should not go up again because that has already been checked
      temp = Stack(loc.board, loc.row  + (2), loc.col) # create node to add to the stack
      temp.down = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue
    
    # There exists a possible path in the right direction
    elif ((loc.board[loc.row][loc.col + 1] == -4) and (loc.right == False)):

      loc.right = True # if we ever return to this node, it should not go right again because that has already been checked
      temp = Stack(loc.board, loc.row, loc.col + (2)) # create node to add to the stack
      temp.left = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue
    
    # There exists a possible path in the down direction
    elif ((loc.row >= 2) and (loc.board[loc.row - 1][loc.col] == -3) and (loc.down == False)):

      loc.down = True # if we ever return to this node, it should not go down again because that has already been checked
      temp = Stack(loc.board, loc.row - (2), loc.col) # create node to add to the stack
      temp.up = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue
    
    # There exists a possible path in the left direction
    elif ((loc.col >= 2) and (loc.board[loc.row][loc.col - 1] == -4) and (loc.left == False)):

      loc.left = True # if we ever return to this node, it should not go left again because that has already been checked
      temp = Stack(loc.board, loc.row, loc.col - (2)) # create node to add to the stack
      temp.right = True # don't go back to where you came from

      # check for duplicate in the stack so we don't re-append the same node
      if (find_dup(stack, temp) == False):
        stack.append(temp)
      continue

    # we hit a dead end
    else:
      stack.pop() # remove node from stack because there is no possible direction to go in, therefore it is a dead end

  return None

# check determine winner for all possible cases of a board state after an action
def checkWinner(row, col, turn):
  
  # if player 2 (squares) made a vertical line as an action in its turn, update the board and see if the state is in a goal state
  if (turn == "p2" and row % 2 == 1):
  
    root.board[row][col] = -3 # take the action
    
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(root.board, 0, 1)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (dw_0(stack) is not None):
      return 2

  # if player 2 (squares) made a horizontal line as an action in its turn, update the board see if the state is in a goal state
  elif (turn == "p2" and row % 2 == 0):
  
    root.board[row][col] = (-4) # take the action
    
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(root.board, 0, 1)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (dw_0(stack) is not None):
      return 2

  # if player 1 (circles) made a vertical line as an action in its turn, update the board see if the state is in a goal state
  elif (turn == "p1" and row % 2 == 0):
  
    root.board[row][col] = (-3) # take the action
    
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(root.board, 1, 0)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (dw_1(stack) is not None):
      return 1

  # if player 1 (circles) made a horizontal line as an action in its turn, update the board see if the state is in a goal state
  elif (turn == "p1" and row % 2 == 1):
  
    root.board[row][col] = (-4) # take the action
    
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(root.board, 1, 0)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (dw_1(stack) is not None):
      return 1

  return 0

# This is very similar to the checkWinner function above, however in this function the heuristic checks possible actions
# instead of taking an action
def checkWinnerKeepRoot(lev, row, col, board, avoidance, need_dw):

  # if player 2 (squares) made a vertical line as an action in its turn, update the board and see if the state is in a goal state
  if (lev % 2 == 0 and row % 2 == 1):
  
    # the heuristic checks what its moves would do, but also checks what would happen if it did not in this location and next turn
    # the opponent took action in this space
    if (avoidance == False):
      board[row][col] = (-3)
    else:
      board[row][col] = (-4)
      
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(board, 0, 1)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (need_dw == True):
      goal_state = dw_0(stack)
      if (goal_state is not None):
        return goal_state
      else:
        return None
        
  # if player 2 (squares) made a horizontal line as an action in its turn, update the board see if the state is in a goal state
  elif (lev % 2 == 0 and row % 2 == 0):
  
    # the heuristic checks what its moves would do, but also checks what would happen if it did not in this location and next turn
    # the opponent took action in this space
    if (avoidance == False):
      board[row][col] = -4
    else:
      board[row][col] = -3
      
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(board, 0, 1)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (need_dw == True):
      goal_state = dw_0(stack)
      if (goal_state is not None):
        return goal_state
      else:
        return None

  elif (lev % 2 == 1 and row % 2 == 0):
  
    # the heuristic checks what its moves would do, but also checks what would happen if it did not in this location and next turn
    # the opponent took action in this space
    if (avoidance == False):
      board[row][col] = -3
    else:
      board[row][col] = -4
      
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(board, 1, 0)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (need_dw == True):
      goal_state = dw_1(stack)
      if (goal_state is not None):
        return goal_state
      else:
        return None
        
  elif (lev % 2 == 1 and row % 2 == 1):
  
    # the heuristic checks what its moves would do, but also checks what would happen if it did not in this location and next turn
    # the opponent took action in this space
    if (avoidance == False):
      board[row][col] = -4
    else:
      board[row][col] = -3
      
    # create the stack for determining if the state is in a goal state
    stack_element = Stack(board, 1, 0)
    stack = []
    stack.append(stack_element)
    
    # check if the state is in a goal state
    if (need_dw == True):
      goal_state = dw_1(stack)
      if (goal_state is not None):
        return goal_state
      else:
        return None

  return None
 
# This agent makes decisioned based on a heuristic. The heuristc randomly preforms actions until the game is a goal state.
# When the current state is a goal state, for each line if the line on the board was part of the winning line then this line's
# weight gets updated. The user collects as many goal states as it can for 3 seconds, which is a reasonable time for a
# human to wait for the AI to move. After the 3 seconds, the line with the highest weight is the action that the agent takes
def SamplingAgent(count, turn):

  # to create game variation so that we aren't testing the same game over and over again
  simulated_annealing = random.uniform(0, 1)
  if (simulated_annealing < 0.1**count):
    coord = SimulatedAnnealingAgent(agent_coords)
    return checkWinner(coord[0], coord[1], turn)
  else:
  
    # copy the root weights array so it can be re used over and over again at its default values
    temp_weights = np.copy(root.weights)
    
    # if player one's turn is upcoming, set org_lev to 1 so it remembers to make a move for player1. Otherwise make a move for
    # player2
    org_lev = 0
    if (turn == "p1"):
      org_lev = 1
    else:
      org_lev = 0
      
    t_end = time.time() + 3 # wait 3 seconds
    
    samples = 0 # record the number of samples recieved for more data
    
    # repeat this process of generating samples for 3 seconds
    while (time.time() < t_end):
    
      done = False # the sample is done being generated when the board is in a goal state
      temp_board = np.copy(root.board) # copy the current game board to be modified
      
      # only check for a winner if neccesairy to be more efficient because determining a winner is expensive
      dw_circle = 0
      dw_square = 0
      
      # set the current level to 0 or 1 depending on the turn
      lev = org_lev
      
      # generate random moves for this sample
      while (done == False):
      
        # create an array of possible moves to take
        options = []
        for row in range(1, 10):
          for col in range(1, 10):
          
            # if a value in a certain position is 2 then the position has not been used
            if (temp_board[row][col] == 2):
              options.append(MoveCoords(row, col))
            elif(dw_square < 4 and temp_board[row][col] == -3 and row % 2 == 1):
              dw_square += 1
            elif(dw_circle < 4 and temp_board[row][col] == -4 and row % 2 == 1):
              dw_circle += 1

        length = len(options) # save time by storing the length in a variable instead of going through the whole list every time
        rand = random.randint(0, (length - 1))
        
        # pick the random move
        row = options[rand].row
        col = options[rand].col
        route = checkWinnerKeepRoot(lev, row, col, temp_board, False, True)
        
        # pick out the route that the goal state took to win
        if (route is not None):
        
          samples += 1 # the sample is done and can be added to the sample count
          done = True # make this the last iteration of the loop because a goal state has been reached
          links = collections.deque() # add the circles or squares that the winner took to a double ended queue
          
          # loop through the circles or squares of the winning route
          for i in range(0, len(route) - 1):
          
            # if the rows of a circle of square are the same then the column in the middle of them is the column taken so add that as a link
            if (route[i].row == route[i + 1].row and route[i].row != 0):
              new_col = (route[i].col + route[i + 1].col) // 2
              links.appendleft(MoveCoords(route[i].row, new_col))
              
            # if the columns of a circle or square are the same then the row in the middle of them is the column taken so add that as a link
            elif (route[i].col == route[i + 1].col and route[i].col != 0):
              new_row = (route[i].row + route[i + 1].row) // 2
              links.appendleft(MoveCoords(new_row, route[i].col))

            # weight the links accordingly
            for item in links:
            
              # if a square wins update the weight accordingly
              if (org_lev % 2 == 0):
                temp_weights[item.row][item.col] += 3
                
              # if a circle wins update the weight accordingly
              else:
                temp_weights[item.row][item.col] += 1
                
              # Note: the squares have a higher weight than the circles because the circles go first and always have a little advantage
              # by having more pieces on the board. The squares be more offensive and the circles should be more defensive because of
              # this

              # if a sample only needed 2 actions to reach a goal state, then if this first action is not taken then the opponent
              # will win. Spike this weight to ensure this move will be the move taken
              if (lev - 1 == org_lev):
                temp_weights[item.row][item.col] += 50
        
        # increment the level, it is not really a level but this indicates how many turns have gone on since the sampling algorithim began
        lev += 1
        
    # find the maximum weight and save the position of the weight
    max = MoveCoords(0, 0)
    for row in range(1, 10):
      for col in range(1, 10):
        if (root.board[row][col] == 2):
          if (max.score < temp_weights[row][col]):
            max.score = temp_weights[row][col]
            max.row = row
            max.col = col
            
    # write the results to a file and return whether or not the action of the last agent resulted in a goal state
    file = open("samplesResultsRvH.txt", "a")
    file.write(str(count) + " " + str(samples) + "\n")
    return checkWinner(max.row, max.col, turn)
  

# This is where the sampling agent recieves the random move to take
def SimulatedAnnealingAgent(arr):

  # find a move that has not already been used
  while (True):
  
    # find a random number
    loc = random.randint(0,40)
    if (root.board[arr[loc].row][arr[loc].col] == 2):
      # send the coordinates of the action that the agent will take back to sampling agent
      coord = []
      coord.append(arr[loc].row)
      coord.append(arr[loc].col)
      return coord

def RandomAgent(arr):

  while (True):
  
    loc = random.randint(0,40)
    if (root.board[arr[loc].row][arr[loc].col] == 2):
      arr[loc].used = True
      return (checkWinner(arr[loc].row, arr[loc].col, turn))

if __name__ == '__main__':
  
  # default set a blank board to all zeros
  blank_board = np.zeros((11, 11), dtype=np.int8)

  global curr_board
  curr_board = np.zeros((11, 11), dtype=int)

  agent_coords = []

  # add to the blank board to make it an empty game board
  # 0 --> squares
  # 1 --> circles
  # 2 --> space that can be a circle or square
  # -3 --> a vertical line
  # -4 --> a horizontal line

  for row in range(0, 11):
    for col in range(0, 11):

      # make the corners null
      if ((row == 0 and col == 0) or (row == 0 and col == 10) or (row == 10 and col == 0) or (row == 10 and col == 10)):
        curr_board[row][col] = (9)

      # make the vertical edges connected (-4)
      elif ((row == 0 or row == 10) and col % 2 == 0):
        curr_board[row][col] = (-4)

      # make the horizontal edges connected (-3)
      elif ((col == 0 or col == 10) and row % 2 == 0):
        curr_board[row][col] = (-3)

      # make the playable areas a 2
      elif (row % 2 == col % 2):
        curr_board[row][col] = (2)
        coords = MoveCoords(row, col)
        agent_coords.append(coords)
        del coords
      
      # make the circles a 1
      elif (row % 2 == 1 and col % 2 == 0):
        curr_board[row][col] = (1)
      
      # make the squares a 0
      elif (row % 2 == 0 and col % 2 == 1):
        curr_board[row][col] = (0)

  # creates the original game board
  global root
  root = Game(curr_board, 0)
  turn = "p1"
  rounds = 1
  p2moves = 0
  start = timer()
  while(True):
    if (turn == "p1"):
      if (RandomAgent(agent_coords) == 1):
        winner = "circles"
        break
      turn = "p2"
    else:
      if (SamplingAgent(p2moves, turn) == 2):
        winner = "squares"
        break
      turn = "p1"
    p2moves += 1
    rounds += 1

  end = timer()
  
  # write game information output to a file for analysis
  elapsed = int(end - start + 1)
  f = open("resultsRvH.txt", "a")
  f.write(winner + " " + str(rounds) + " " + str(elapsed) + '\n')
  f.close()
