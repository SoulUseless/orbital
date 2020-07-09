# Database Setup  
For our database, we have the following layout:  
(Bold text refers to ObjectIds of other Schemas -- Foreign Keys)  

Challenge  
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Title of Challenge.
description|String|Brief Description of Challenge.
requirements|Array of **Challenge**|Prerequisite Challenges.
requiredFor|Array of **Challenge**|Challenges that this Challenge is prerequisite of.
course|**Course**|Course that this challenge belongs to.
taskDescription|String|Specific completion requirements of Challenge.
testCases|Object<br />(Refer to Test Cases for format)|Test Cases of Challenge.<br />(only public test cases will be visible)
submissions|Array of **Submission**|Array of Student Submissions to Challenge.

Course
Field|Descriptors|Remarks
-----|-----------|---------
tier|**Tier**|Tier level of Course. <br />(Bronze, Silver, Gold, Platinum)
language|**Language**|Language Requirement of Course.
challenges|Array of **Challenge**|Required Challenges for course completion.

Language
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Name of Language.
logo|String|Location of Logo.
jdoodleName|String|Name of language as stored in Jdoodle.
jdoodleVersion|String|Language Index of language as stored in Jdoodle.
fileExtension|String|File Extension associated with the language.

Startup
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Name of Startup.
logo|String|Location of Startup Logo.
description|String|Description of Startup.
challenges|Array of **StartupChallenge**|StartupChallenges by Startup.
email|String|Email of startup, acts as username.
password|String|Password of startup for logging in.<br />Encrypted using bcryptjs.

StartupChallenge
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Title of StartupChallenge.
owner|**Startup**|Owner of StartupChallenge.
description|String|Brief Description of StartupChallenge.
requirements|Array of **Course**|Prerequisites of StartupChallenge.
taskDescription|String|Specific completion requirements of StartupChallenge.
testCases|Object<br />(Refer to Test Cases for format)|Test Cases of StartupChallenge.<br />(only public test cases will be visible)
submissions|Array of **Submission**|Array of Student Submissions to Challenge

Student
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Name of Student
profilePicture|String|Location of profile picture.
profileDescription|String|Brief Description of Student.<br />Additional information like GitHub page can be placed here
challengeSubmissions|Array of **Submission**|Submissions by Student, both internal Challenge and StartupChallenge.
completedChallenges|Array of **Challenge**|Completed internal Challenges by Student
completedStartupChallenges|Array of **StartupChallenge**|Completed StartupChallenges by Student.
email|String|Email of startup, acts as username.
password|String|Password of startup for logging in.<br />Encrypted using bcryptjs.
credentials|Array of **Course**|Attained Tiers of Student.

Submission
Field|Descriptors|Remarks
-----|-----------|---------
file|String|Location of submitted file.
owner|**Student**|Student who submitted.
success|Boolean|Tracks whether the submission is correct or not.

Tier
Field|Descriptors|Remarks
-----|-----------|---------
name|String|Name of Tier. <br />(Bronze, Silver, Gold, Platinum)

# API Endpoints

Challenges (root: **/api/challenge**)
Function Name|Type|Route|Description
---------|-----|----|------------
getAllChallenge|GET|/|Retrieves all internal challenges and their details.  
getChallengeById|GET|/:cid|Retrieves one internal challenge by its cid and their details.  
uploadSubmissionById*|POST|/:cid/submissions|Enables uploading of submission files by Student. <br />Submissions are sent to jdoodle API and path stored in MongoDB. <br /> Credentials and completion trackers automatically given upon verification.

*requires valid Student token  <br />

StartupChallenges (root: **/api/startup-challenge**):
Function Name|Type|Route|Description
---------|-----|----|------------
getAllChallenges|GET|/all|Retrieves all internal challenges and their details.
getChallengeById|GET|/:cid|Retrieves one internal challenge by its cid and their details.
getChallengeByStartup|GET|/startup/:sid|Retrieves all internal challenges by a startup and their details using their sid.
getSubmissionById**|GET|/:cid/submissions|Retrieves all submissions by Students on one challenge by its cid.
uploadSubmissionById*|POST|/:cid/submissions|Enables uploading of submission files by Student.<br />Submissions are sent to jdoodle API and path stored in MongoDB.<br />Credentials and completion trackers automatically given upon verification.
updateStartupChallengeById**|PATCH|/:cid|Enables editing of the details of StartupChallenge of Startup.<br />Allows uploading of new test cases in JSON.<br />Token verification to ensure only the owner can edit their challenge.
deleteStartupChallengeById**|DELETE|/:cid|Enables deletion of the StartupChallenge of Startup.<br />Token verification to ensure only the owner can delete the challenge.
createStartupChallenge**|POST|/new|Enables creation of new StartupChallenge by Startup.<br />Allows uploading of new test cases in JSON.

*requires valid Student token  
**requires valid Startup token  <br />

Startup (root: **/api/startup**):
Function Name|Type|Route|Description
---------|-----|----|------------
getStartupById|GET|/:sid|Retrieves one Startup by its sid and their details.
Data depends on parsed token.
startupLogin|POST|/login|Logs in a Startup.<br />Verifies log in information.<br />Returns a token.
startupSignup|POST|/signup|Creates a Startup account.<br />Enables uploading a file as profile image.<br />Returns a token.
getAllStartups|GET|/|Retrieves all Startup information.
startupUpdate**|POST|/:sid/update|Enables editing of the details of Startup.<br />Allows uploading of new profile picture.<br />Token verification to ensure only the owner can edit their profile.

**requires valid Startup token <br />

Student (root: **/api/student**):
Function Name|Type|Route|Description
---------|-----|----|------------
getSubmissionsByStudentId*|GET|/:sid/submissions|Retrieves all submissions by Student by its sid.
getCredentialsByStudentId|GET|/:sid/credentials|Retrieves all credentials of Student by its sid.
getStudentById|GET|/:sidRetrieves one Student by its sid and their details.|Data depends on parsed token.
studentLogin|POST|/login|Logs in a Student.<br />Verifies log in information.<br />Returns a token.
studentSignup*|POST|/signup|Creates a Student account.<br />Enables uploading a file as profile image.<br />Returns a token.
getAllStudents|GET|/|Retrieves all Student information.
studentUpdate*|PATCH|/:sid|Enables editing of the details of Student.<br />Allows uploading of new profile picture. <br />Token verification to ensure only the owner can edit their profile.

*requires valid Student token <br />

Tier (root: **/api/tier**):
Function Name|Type|Route|Description
---------|-----|----|------------
getAllTiers|GET|/|Retrieves all Tiers.<br />Mainly used for rendering information.

Language (root: **/api/language**):
Function Name|Type|Route|Description
---------|-----|----|------------
getAllLanguages|GET|/|Retrieves all Languages. <br />Mainly used for rendering information.

Debug (root: **/api/debug**): **This are administrator functions**
Function Name|Type|Route|Description
---------|-----|----|------------
createNewLanguage|POST|/language/new|Creates new Language.<br />Used for initialising information.
createNewTier|POST|/tier/new|Creates new Tier.<br />Used for initialising information.
createNewCourse|POST|/course/new|Creates new Course (Progression Tier).<br />Used for initialising information.
createNewChallenge|POST|/challenge/new|Enables creation of new Challenge.<br />Automatically updates dependency Challenges.
updateChallenge|POST|/challenge/:cid/update|Enables editing of the details of Challenge by :cid.<br />Flexible to allow for partial edits depending on request body. <br />Automatically updates dependency Challenges.
deleteChallenge|DELETE|/challenge/:cid/delete|Enables deletion of the Challenge by :cid. <br />Automatically updates dependency Challenges.

