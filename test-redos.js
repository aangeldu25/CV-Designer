const text = `[Sign in](https://www.linkedin.com/login?emailAddress=&fromSignIn=&fromSignIn=true&session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fjobs%2Fview%2F4392480038%2F&trk=public_jobs_nav-header-signin)[Join now](https://www.linkedin.com/signup/cold-join?source=jobs_registration&session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fjobs%2Fview%2F4392480038%2F&trk=public_jobs_nav-header-join)[![Image 1](https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2)](https://www.linkedin.com/login?emailAddress=&fromSignIn=&fromSignIn=true&session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fjobs%2Fview%2F4392480038%2F&trk=public_jobs_nav-header-signin) ![Image 2: Gold & Aron](https://media.licdn.com/dms/image/v2/D4E0BAQH_F2SBM0vxpg/company-logo_100_100/B4EZdqEdS_HsAQ-/0/1749831243324/gold_aron_conseil_logo?e=2147483647&v=beta&t=81HgmFzM43wHGFTY0Fqn84bskDdfULGZjHXyyyYn_1s)`;

let finalJobDescription = text;

console.time('images');
finalJobDescription = finalJobDescription.replace(/!\[.*?\]\([^)]*\)/g, '');
console.timeEnd('images');

console.time('links1');
finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
console.timeEnd('links1');

console.time('links2');
finalJobDescription = finalJobDescription.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
console.timeEnd('links2');

console.log(finalJobDescription);
