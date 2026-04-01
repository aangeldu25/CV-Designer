const text = "![Image 1](https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2) ".repeat(10000);
const start = Date.now();
let res = text.replace(/!\[.*?\]\([^)]*\)/g, '');
console.log("Time 1:", Date.now() - start);

const text2 = "[Sign in](https://www.linkedin.com/login?emailAddress=&fromSignIn=&fromSignIn=true&session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fjobs%2Fview%2F4392480038%2F&trk=public_jobs_nav-header-signin) ".repeat(10000);
const start2 = Date.now();
let res2 = text2.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
console.log("Time 2:", Date.now() - start2);
