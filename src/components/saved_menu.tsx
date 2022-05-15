import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface SavedMenuProps {
    name: string;
    selected: boolean;
    onClick: (name: string) => void;
    onClickDelete?: (name: string) => void | undefined | null;
}

export default function SavedMenu({ name, selected = false, onClick, onClickDelete }: SavedMenuProps) {
    const _onClick = () => {
        onClick(name);
    }

    const _onClickDelete = () => {
        if (!onClickDelete) return;
        onClickDelete(name);
    }

    return (
        <div class={`${!!onClickDelete ? 'flex flex-row justify-between' : ''}`}>
            <div class={`${selected ? 'bg-slate-600/50 border border-slate-800/75 border-b-violet-500 ' : ''}px-2 mx-2 focus-border hover-border w-full text-left`} onClick={_onClick}>
                <span>{name}</span>
            </div>
            {!!onClickDelete &&
                <div onClick={_onClickDelete}>
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            }
        </div>
    )




}