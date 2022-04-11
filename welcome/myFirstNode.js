const course = {
    name: "Databases, Networks, and the Web",
    platform: "Coursera",
    category: "Computer Science"
};

function printCourseInformation(course) {
    let output = '';
    for(key in course) {
        output += `${key}: ${course[key]}
        `;
    }
    console.log(output);
}

printCourseInformation(course);

console.log(course);