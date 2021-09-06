import React from 'react';
import './CodeCard.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { agate } from 'react-syntax-highlighter/dist/esm/styles/hljs';


interface Props {
    explanation: string;
    code: string;
    id: string;
    onChildClick: (id: string) => void;
}

const processCode = (code: string) => {
    let lines = code.split(' '.repeat(16));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(' '.repeat(16))) {
            lines[i] = '\n' + '\t'.repeat(3) + lines[i];
        }
    }
    let linesStr = lines.join('\n');
    lines = linesStr.split(' '.repeat(8));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(' '.repeat(8))) {
            lines[i] = '\n' + '\t'.repeat(2) + lines[i];
        }
    }
    linesStr = lines.join('\n');
    lines = linesStr.split(' '.repeat(4));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(' '.repeat(4))) {
            lines[i] = '\n' + '\t'.repeat(1) + lines[i];
        }
    }
    linesStr = lines.join('\n');
    lines = linesStr.split(' '.repeat(2));
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(' '.repeat(2))) {
            lines[i] = '\n' + lines[i];
        }
    }

    let n = lines[lines.length - 1].lastIndexOf(' ');
    if (n > 0) {
        lines[lines.length - 1] = lines[lines.length - 1].substring(0, n) + '\n' + lines[lines.length - 1].substring(n + 1);
    }
    return lines.join('\n');
}

const CodeCard: React.FC<Props> = ({ explanation, code, id, onChildClick }: Props) => {

    function handleClick(event: any) {
        console.log(onChildClick)
        onChildClick(id);
    }

    return (<div className="card" id={id}>
        <div className="code">
            <SyntaxHighlighter language="javascript" style={agate}
                wrapLongLines={true}
            >
                {code}
            </SyntaxHighlighter>
        </div>
        <div className="explanation">
            {explanation}
            <button className="delete" onClick={handleClick}>x</button>
        </div>
    </div>);
}

export default CodeCard;

