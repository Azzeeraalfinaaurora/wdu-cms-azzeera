const fs = require('fs');
let html = fs.readFileSync('scratch.html', 'utf-8');

// Extract body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : html;

// Convert class to className
bodyContent = bodyContent.replace(/class=/g, 'className=');

// Convert HTML comments to JSX comments
bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Convert onclick
bodyContent = bodyContent.replace(/onclick="([^"]*)"/g, (match, script) => {
    return `onClick={() => { ${script} }}`;
});

// Convert SVG attributes
bodyContent = bodyContent.replace(/viewbox/gi, 'viewBox');
bodyContent = bodyContent.replace(/stroke-linecap/g, 'strokeLinecap');
bodyContent = bodyContent.replace(/stroke-linejoin/g, 'strokeLinejoin');
bodyContent = bodyContent.replace(/stroke-width/g, 'strokeWidth');
bodyContent = bodyContent.replace(/fill-rule/g, 'fillRule');
bodyContent = bodyContent.replace(/clip-rule/g, 'clipRule');

// Close unclosed tags
bodyContent = bodyContent.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
bodyContent = bodyContent.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');

const finalCode = `import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      ${bodyContent}
    </div>
  );
};

export default HomePage;
`;

fs.writeFileSync('src/pages/HomePage.tsx', finalCode);
console.log('Successfully written to src/pages/HomePage.tsx');
