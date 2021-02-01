# schedule-generator

The whole application is used for generating a course schedule for educational purposes. 
The user interface is created using React.JS and the back-end part is consisted of two separate applications that represent two parts:  

1. Handles the initial data (available subjects, staff, students), generates courses and generates groups; 
2. Generates the schedule using the previously created data.  

Part one was created using Java Spring Boot and it shares the same database as the second application, in order for the second part to use the data that would be generated in the first. In this part, the initial data is either imported from a text file or the user could reuse the existing data for the subject and staff (if it exists), then the students are also imported from a text file. All of the relationships between the entities are handled in the background during the import phase. After the data has been setup, the user chooses which semester they want to be created and courses are generated from the subjects that belong to the chosen semester and that have enough students that enrolled in it. Finally, the user choses which type of groups they want to be created for the generated courses and get a preview of all of the groups that have been generated. The preview features the name of the courses and the number of groups that have been created for it, which staff members have been assigned and the capacity of each of the groups.
