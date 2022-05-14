interface SavedMenuProps {
    name: string;
    selected: boolean;
    onClick: (name: string) => void;
}

export default function SavedMenu({ name, selected = false, onClick }: SavedMenuProps) {
    const _onClick = () => {
        onClick(name);
    }

    return (
        <div class={`${selected ? 'bg-slate-600/50 border border-slate-800/75 border-b-violet-500 ' : ''}px-2 mx-2 focus-border hover-border`} onClick={_onClick}>
            <span>{name}</span>
        </div>
    )




}