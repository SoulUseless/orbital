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

