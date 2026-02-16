import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { MetallicButton } from "../ui/MetallicButton";

interface ResumeEditorPanelProps {
    data: any;
    onChange: (newData: any) => void;
}

export function ResumeEditorPanel({ data, onChange }: ResumeEditorPanelProps) {
    const updateField = (section: string, field: string, value: any) => {
        onChange({
            ...data,
            [section]: { ...data[section], [field]: value }
        });
    };

    return (
        <div className="w-96 bg-midnight-900 border-r border-white/5 flex flex-col h-full overflow-hidden text-sm">
            <div className="p-4 border-b border-white/5 bg-white/5 font-bold text-white tracking-wider uppercase text-xs">
                Editor
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {/* Personal Info */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold text-pear-200 uppercase tracking-widest">Personal Info</h3>
                    <div className="space-y-2">
                        <Input label="Name" value={data.personal_info.name} onChange={(v) => updateField('personal_info', 'name', v)} />
                        <Input label="Email" value={data.personal_info.email} onChange={(v) => updateField('personal_info', 'email', v)} />
                        <Input label="Phone" value={data.personal_info.phone} onChange={(v) => updateField('personal_info', 'phone', v)} />
                        <Input label="LinkedIn" value={data.personal_info.linkedin} onChange={(v) => updateField('personal_info', 'linkedin', v)} />
                        <Input label="GitHub" value={data.personal_info.github} onChange={(v) => updateField('personal_info', 'github', v)} />
                    </div>
                </section>

                {/* Experience */}
                <SectionList
                    title="Experience"
                    items={data.experience}
                    onUpdate={(newItems) => onChange({ ...data, experience: newItems })}
                    itemTitleKey="company"
                    renderFields={(item, updateItem) => (
                        <>
                            <Input label="Title" value={item.title} onChange={(v) => updateItem('title', v)} />
                            <Input label="Company" value={item.company} onChange={(v) => updateItem('company', v)} />
                            <Input label="Location" value={item.location} onChange={(v) => updateItem('location', v)} />
                            <Input label="Dates" value={item.dates} onChange={(v) => updateItem('dates', v)} />
                            <TextArea label="Bullets (one per line)" value={item.bullets.join('\n')} onChange={(v) => updateItem('bullets', v.split('\n'))} />
                        </>
                    )}
                    newItem={{ title: "New Role", company: "Company", location: "Location", dates: "Dates", bullets: ["Responsibility"] }}
                />

                {/* Education */}
                <SectionList
                    title="Education"
                    items={data.education}
                    onUpdate={(newItems) => onChange({ ...data, education: newItems })}
                    itemTitleKey="school"
                    renderFields={(item, updateItem) => (
                        <>
                            <Input label="School" value={item.school} onChange={(v) => updateItem('school', v)} />
                            <Input label="Degree" value={item.degree} onChange={(v) => updateItem('degree', v)} />
                            <Input label="Location" value={item.location} onChange={(v) => updateItem('location', v)} />
                            <Input label="Dates" value={item.dates} onChange={(v) => updateItem('dates', v)} />
                        </>
                    )}
                    newItem={{ school: "University", degree: "Degree", location: "Location", dates: "Dates" }}
                />

                {/* Projects */}
                <SectionList
                    title="Projects"
                    items={data.projects}
                    onUpdate={(newItems) => onChange({ ...data, projects: newItems })}
                    itemTitleKey="name"
                    renderFields={(item, updateItem) => (
                        <>
                            <Input label="Name" value={item.name} onChange={(v) => updateItem('name', v)} />
                            <Input label="Tech Stack" value={item.technologies} onChange={(v) => updateItem('technologies', v)} />
                            <Input label="Dates" value={item.dates} onChange={(v) => updateItem('dates', v)} />
                            <TextArea label="Bullets (one per line)" value={item.bullets.join('\n')} onChange={(v) => updateItem('bullets', v.split('\n'))} />
                        </>
                    )}
                    newItem={{ name: "Project", technologies: "Tech", dates: "Dates", bullets: ["Description"] }}
                />
            </div>
        </div>
    );
}

function SectionList({ title, items, onUpdate, itemTitleKey, renderFields, newItem }: any) {
    const [expanded, setExpanded] = useState<number | null>(null);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate(newItems);
    };

    const addItem = () => onUpdate([...items, newItem]);
    const deleteItem = (index: number) => onUpdate(items.filter((_: any, i: number) => i !== index));

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-pear-200 uppercase tracking-widest">{title}</h3>
                <button onClick={addItem} className="text-metal-400 hover:text-white"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
                {items.map((item: any, i: number) => (
                    <div key={i} className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                        <div
                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5"
                            onClick={() => setExpanded(expanded === i ? null : i)}
                        >
                            <span className="font-medium text-white truncate">{item[itemTitleKey]}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); deleteItem(i); }} className="text-metal-500 hover:text-red-400">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                                {expanded === i ? <ChevronDown className="w-3 h-3 text-metal-400" /> : <ChevronRight className="w-3 h-3 text-metal-400" />}
                            </div>
                        </div>
                        {expanded === i && (
                            <div className="p-3 border-t border-white/5 space-y-3 bg-black/20">
                                {renderFields(item, (field: string, val: any) => updateItem(i, field, val))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

function Input({ label, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] text-metal-400 uppercase tracking-wider">{label}</label>
            <input
                className="w-full bg-midnight-900 border border-white/10 rounded px-2 py-1.5 text-white focus:border-pear-500/50 outline-none transition-colors"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function TextArea({ label, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] text-metal-400 uppercase tracking-wider">{label}</label>
            <textarea
                className="w-full bg-midnight-900 border border-white/10 rounded px-2 py-1.5 text-white focus:border-pear-500/50 outline-none transition-colors min-h-[80px]"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
