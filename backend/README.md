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
