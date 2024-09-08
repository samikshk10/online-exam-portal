import { useEffect, useState } from 'react';
import { LeetCodeQuestion, Question } from '../../types/question';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { findLanguageCode, languageMimeTypeMap } from '../../helper/helper';
import { SessionStorage } from '../../helper/sessionStorage';

interface CodeMirrorIDEType {
    question: Question | null;
    code: any;
    currentLanguage: string;
    algorithmQuestion: LeetCodeQuestion | null;
    setCode: React.Dispatch<any>;
}

function CodeMirrorIDE(props: CodeMirrorIDEType) {
    const { question, code, currentLanguage, algorithmQuestion, setCode } =
        props;
    const [options, setOptions] = useState({
        lineWrapping: true,
        mode: currentLanguage.toLowerCase() ?? 'JavaScript',
        lint: true,
        theme: 'dracula',
        lineNumbers: true,
        smartIndent: true,
        showCursorWhenSelecting: true,
    });

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            mode: languageMimeTypeMap[currentLanguage.toLowerCase()],
        }));
        // if(question) {

        const savedCode = SessionStorage.getSessionItem(
            `code-${question && question.id}-${currentLanguage}`
        );
        // }
        if (algorithmQuestion && !savedCode)
            setCode((prevValues: any) => ({
                ...prevValues,
                [question!.id]: findLanguageCode(
                    algorithmQuestion.codeSnippets,
                    currentLanguage
                ),
            }));
    }, [currentLanguage, algorithmQuestion]);

    useEffect(() => {
        // Load code from session storage when the component mounts
        if (question) {
            const savedCode = SessionStorage.getSessionItem(
                `code-${question.id}-${currentLanguage}`
            );
            if (savedCode) {
                setCode((prevValues: any) => ({
                    ...prevValues,
                    [question.id]: savedCode,
                }));
            }
        }
    }, [question && question.id, currentLanguage]);

    const handleCodeChange = (value: string) => {
        if (question) {
            setCode((prevValues: any) => ({
                ...prevValues,
                [question.id]: value,
            }));
            // Save code to session storage
            SessionStorage.setSessionItem(
                `code-${question.id}-${currentLanguage}`,
                value
            );
        }
    };

    return (
        <CodeMirror
            value={question && code[question.id]}
            options={options}
            onBeforeChange={(_editor, _data, value) => {
                handleCodeChange(value);
            }}
            onPaste={(_editor, _event) => {
                // Toast.Error('Pasting is not allowed!');
                // event.preventDefault();
            }}
        />
    );
}

export default CodeMirrorIDE;
