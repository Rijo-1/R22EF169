# Task 1
## Social Media Analytics Frontend

Building this React-based Social Media Analytics app with TailwindCSS was an exciting challenge. The goal was simple: create a dashboard that provides instant insights into social media activity. But as always, execution was the tricky part. From authentication hurdles to optimizing API calls, here’s how it all came together.

## API Challenges & CORS Issues 

API required an access token, which was easy to handle, but then came the dreaded **CORS errors**. Since the API lacked proper CORS headers, our requests were blocked. To bypass this, we temporarily used **CORS Anywhere**, which helped us proceed but wasn’t a long-term fix. 

## Data Fetching & Performance Optimization 

Fetching users and posts was straightforward, but efficiently sorting and displaying them was a different story. Since our UI needed **real-time updates**, we used **SWR (stale-while-revalidate)** to manage data fetching, keeping things fresh without overloading the server. This improved responsiveness and made the experience much smoother.


# Task 2 

## Average Claculator HTTP Microservice 

Developed a frontend interface so that values will be fetched from apis but had issues with Apis as it had an cors issue . 
Also had less time to develop beause spend a lot of time in task 1


# Also temp-233 is my account only have some issues with VS source control
