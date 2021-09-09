import React, { useEffect } from 'react';
import './CodeCard.css'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { agate } from 'react-syntax-highlighter/dist/esm/styles/hljs';


interface Props {
    explanation: string;
    code: string;
    id: string;
    onChildClick: (id: string) => void;
}

const CodeCard: React.FC<Props> = ({ explanation, code, id, onChildClick }: Props) => {

    function handleClick(event: any) {
        console.log(onChildClick)
        onChildClick(id);
    }


    const spanRef = React.useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (spanRef.current) {
            spanRef.current.innerHTML = explanation;
        }
    }, [spanRef.current, explanation]);

    return (<div className="card" id={id}>
        <div className="code">
            <SyntaxHighlighter language="javascript" style={agate}
                wrapLongLines={true}
            >
                {code.trimStart()}
            </SyntaxHighlighter>
        </div>
        <div className="explanation">
            <span ref={spanRef} />
            <button className="delete" onClick={handleClick}>x</button>
        </div>
    </div>);
}

export default CodeCard;

