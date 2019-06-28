import React from "react"

/**
 * @param {{ queries: any[] }} props 
 */
export default function QueryList(props) {
    return (
        <div>
            <div>Saved queries</div>
            <ul>
                {props.queries.map((query, i) => (
                    <li key={i}>Some text</li>
                ))}
            </ul>

        </div>
    )
}
