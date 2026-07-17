import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, Check, Loader2 } from "lucide-react";

/**
 * CreatableDropdown
 *
 * Props:
 *  - label         {string}   Field label
 *  - required      {boolean}  Whether field is required
 *  - options        {Array}    [{ value, label }]
 *  - value         {string}   Currently selected value (id as string)
 *  - onChange      {fn}       (value: string) => void
 *  - onAddNew      {fn}       async (name: string) => void  — called to create a new item
 *  - placeholder   {string}   Dropdown placeholder text
 *  - addPlaceholder{string}   Input placeholder for the "add new" bar
 *  - error         {string}   Validation error message
 *  - adding        {boolean}  True while new item is being saved
 */
function CreatableDropdown({
    label,
    required = false,
    options = [],
    value = "",
    onChange,
    onAddNew,
    placeholder = "Select an option",
    addPlaceholder = "Type to add new…",
    error,
    adding = false,
}) {
    const [addText, setAddText] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showAdd && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showAdd]);

    const handleAdd = async () => {
        const trimmed = addText.trim();
        if (!trimmed) return;
        await onAddNew(trimmed);
        setAddText("");
        setShowAdd(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
        if (e.key === "Escape") {
            setShowAdd(false);
            setAddText("");
        }
    };

    const selectedLabel = options.find((o) => String(o.value) === String(value))?.label || "";

    return (
        <div className="cdd-wrapper">
            {label && (
                <label className="cdd-label">
                    {label} {required && <span className="cdd-required">*</span>}
                </label>
            )}

            {/* Native select (hidden visually) for form required validation */}
            <select
                className="cdd-hidden-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                aria-hidden="true"
                tabIndex={-1}
            >
                <option value=""></option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Styled visible select */}
            <select
                className={`cdd-select ${error ? "cdd-select--error" : ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Add new bar */}
            {!showAdd ? (
                <button
                    type="button"
                    className="cdd-add-trigger"
                    onClick={() => setShowAdd(true)}
                >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Add {label || "new"}</span>
                </button>
            ) : (
                <div className="cdd-add-row">
                    <input
                        ref={inputRef}
                        type="text"
                        className="cdd-add-input"
                        placeholder={addPlaceholder}
                        value={addText}
                        onChange={(e) => setAddText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={adding}
                    />
                    <button
                        type="button"
                        className="cdd-add-btn"
                        onClick={handleAdd}
                        disabled={adding || !addText.trim()}
                    >
                        {adding ? (
                            <Loader2 size={14} className="cdd-spin" />
                        ) : (
                            <Check size={14} />
                        )}
                        {adding ? "Adding…" : "Add"}
                    </button>
                    <button
                        type="button"
                        className="cdd-cancel-btn"
                        onClick={() => { setShowAdd(false); setAddText(""); }}
                        disabled={adding}
                    >
                        ✕
                    </button>
                </div>
            )}

            {error && <div className="cdd-error">{Array.isArray(error) ? error[0] : error}</div>}

            <style>{`
                .cdd-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .cdd-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #6c757d;
                    letter-spacing: 0.3px;
                    margin-bottom: 0;
                }

                .cdd-required {
                    color: #e74c3c;
                    margin-left: 2px;
                }

                .cdd-hidden-select {
                    position: absolute;
                    opacity: 0;
                    width: 0;
                    height: 0;
                    pointer-events: none;
                }

                .cdd-select {
                    width: 100%;
                    padding: 9px 14px;
                    border-radius: 10px;
                    border: 1.5px solid #dee2e6;
                    background: #fff;
                    font-size: 0.92rem;
                    color: #212529;
                    transition: border-color 0.18s, box-shadow 0.18s;
                    outline: none;
                    cursor: pointer;
                    appearance: auto;
                }

                .cdd-select:focus {
                    border-color: #43e97b;
                    box-shadow: 0 0 0 3px rgba(67, 233, 123, 0.15);
                }

                .cdd-select--error {
                    border-color: #dc3545;
                }

                .cdd-select--error:focus {
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
                }

                .cdd-add-trigger {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 12px;
                    border: 1.5px dashed #43e97b;
                    border-radius: 8px;
                    background: rgba(67, 233, 123, 0.06);
                    color: #27ae60;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.18s;
                    width: fit-content;
                    letter-spacing: 0.2px;
                }

                .cdd-add-trigger:hover {
                    background: rgba(67, 233, 123, 0.15);
                    border-color: #27ae60;
                    transform: translateY(-1px);
                }

                .cdd-add-row {
                    display: flex;
                    gap: 6px;
                    align-items: stretch;
                }

                .cdd-add-input {
                    flex: 1;
                    padding: 7px 12px;
                    border-radius: 8px;
                    border: 1.5px solid #43e97b;
                    font-size: 0.88rem;
                    outline: none;
                    transition: box-shadow 0.18s;
                    color: #212529;
                }

                .cdd-add-input:focus {
                    box-shadow: 0 0 0 3px rgba(67, 233, 123, 0.2);
                }

                .cdd-add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 7px 14px;
                    border-radius: 8px;
                    border: none;
                    background: linear-gradient(135deg, #43e97b, #38f9d7);
                    color: white;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: opacity 0.18s, transform 0.18s;
                }

                .cdd-add-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .cdd-add-btn:not(:disabled):hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .cdd-cancel-btn {
                    padding: 7px 10px;
                    border-radius: 8px;
                    border: 1.5px solid #dee2e6;
                    background: #fff;
                    color: #6c757d;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                }

                .cdd-cancel-btn:hover {
                    background: #f8f9fa;
                    color: #343a40;
                }

                .cdd-error {
                    font-size: 0.8rem;
                    color: #dc3545;
                    margin-top: 2px;
                }

                @keyframes cdd-spin {
                    to { transform: rotate(360deg); }
                }

                .cdd-spin {
                    animation: cdd-spin 0.8s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default CreatableDropdown;
