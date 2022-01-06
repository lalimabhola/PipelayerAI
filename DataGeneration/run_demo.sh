# Summer Martin, Lalima Bhola, Dom Lamastra
# CSC 380 Pipelayer Project

#!/bin/sh
start_time=$SECONDS
#runs the random vs heuristic game 500 times
echo "Running Random vs Heuristic game 500 times..."
echo "This may take a while..."
for i in {1..500}
do
   echo "Running Game $i"
   python3 randomVHeuristic.py
   
done
echo "Printing Results for Random vs Heuristic..."
# prints the results of the random vs heuristic game
echo "$(cat resultsRvH.txt)"
# runs the heuristic vs heuristic game 500 times
echo "Running Heuristic vs Heuristic game 500 times..."
echo "This may take a while..."
for j in {1..500}
do
   echo "Running Game $j"
   python3 heuristicVHeuristic.py
   
done
elapsed=$(( SECONDS - start_time ))
echo "Time: $elapsed Seconds"
echo "Printing Results for Heuristic vs Heuristic..."
# prints the results of the random vs heurisitc game
echo "$(cat resultsHvH.txt)"
# calculates the results of the generated data
echo "Calculating Data..."
python3 analysis.py
echo "Completed @ `date`"