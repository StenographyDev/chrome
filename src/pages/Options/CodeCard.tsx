import React from 'react';
import './CodeCard.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { agate } from 'react-syntax-highlighter/dist/esm/styles/hljs';


interface Props {
    explanation: string;
    code: string;
}

const CodeCard: React.FC<Props> = ({ explanation, code }: Props) => {
    return (<div className="card">
        <div className="code">
            <SyntaxHighlighter language="javascript" style={agate}
                lineProps={{ style: { paddingBottom: 8 } }}
                wrapLongLines={true}
                wrapLines={true}>
                {code}
            </SyntaxHighlighter>
        </div>
        <div className="explanation">
            {explanation}
        </div>
    </div>);
}

export default CodeCard;

