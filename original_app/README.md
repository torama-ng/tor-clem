Title : Torama Videos
Objective : A videos portal for student to stream video for learning purpose.
Technology : nodejs
Things Done :
1. Added a click listener to the search button. 
2. Created a loop, that will loop through all the directories in the videos folder.
3. Display of all videos when button is clicked.

Brief explanation:

I worked on a search bar that will render to a user a particular video, he/she is searching for, When user types a search string and clicks the button. The program is going to loop through all the files in our videos directory and show the particular video or show all the videos in the case of no videos found.


Work is still in progress.


Updates

1. completed the search button, user can now search for a particular video now.
2. Added a all videos category, user can now check all videos in the directories.
3. Recommended video can be shown to user once page is opened to he/she.
4. uploading of files to our directory


Videos Used for MongoDb Database Management

https://www.youtube.com/watch?v=Do_Hsb_Hs3c&t=24s
Node JS MongoDB Tutorials by Derek Banas



New Features added

1. Playlist is added, user can now add videos to their playlist.
2. The playlist is added as a nested object inside of the user data
3. A videos collection is created in Mongodb using mongoose, to track comments of videos and to to give room for video viewers collection.
4. Video views are updated anytime user views any video. A video id is tracked and the vid_views is updated by the initial views + 1.
5. All videos are now loaded from mongodb database and not from list any more
6. User can now add comments to a particular video.
7. Facebook login is included user can now login with facebook.
8. Viewer collections is added to check if a user had already viewed the video previously.
9. Video thumbnails can be dynamically gotten from a video using the built in module called "child_process" and ffmpeg
   NOTE -You need a ffmpeg installed on your system