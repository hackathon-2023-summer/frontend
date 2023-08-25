/*--------------------------*/
/* サブルーチン[作成手順の出力] */
/*--------------------------*/
import  React,{ useState } from "react";
import formStyles from '../../styles/form.module.css';
import generalStyle from "../../styles/generalStyle.module.css";

type ExtendedKeyboardEvent = React.KeyboardEvent<HTMLInputElement> & {
    isComposing: boolean;
};

/*---- 「作成手順の出力」本体 ----*/
export default function CreateSteps() {
    const [procedureList, setProcedureList] = useState([{ id: 1, text: '' }]);

    /*---- 新しい入力欄を出力する ----*/
    const handleClickInput = (index: number) => {
        const lastProcedure = procedureList[procedureList.length - 1];

        if (lastProcedure.text.trim() !== '') {
            const newProcedure = { id: Date.now(), text: '' };
            const newProcedureList = [...procedureList];
            newProcedureList.splice(index + 1, 0, newProcedure);
            setProcedureList(newProcedureList);

            // setTimeoutを使用してフォーカスを遅延させる
            setTimeout(nextFocusElement, 0);
        }
    }

    /*---- 出力されたinputエリアを活性化 ----*/
    const nextFocusElement = () => {
        const thisPrecedure = document.getElementsByClassName("thisPrecedure");
        const thisPrecedureLngth = thisPrecedure.length;
        const lastElement = thisPrecedure[thisPrecedureLngth - 1] as HTMLInputElement;
        lastElement.focus();
    }

    /*---- 出力DOM ----*/
    return (
        <div>
            {procedureList.map((procedure, index) => (
            <div
                key={procedure.id}
                className={`${generalStyle.flxrow} ${formStyles.procedureInnerBox}`}
            >
                <p>手順：{index + 1}</p>
                <input
                type="text"
                className="thisPrecedure"
                value={procedure.text}
                onClick={() => handleClickInput(index)}
                onChange={(e) => {
                    const newProcedureList = [...procedureList];
                    newProcedureList[index].text = e.target.value;
                    setProcedureList(newProcedureList);
                }}
                />
            </div>
            ))}
        </div>
    );
}
