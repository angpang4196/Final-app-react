import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "../..";
import { REST_SERVER_ADDRESS } from "../../common/Constant";
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/NavBar";

function DeactivatePage() {

    const passRef = useRef("");
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);
    const [step, setStep] = useState(0);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const deactivateHandle = (evt) => {
        const xhr = new XMLHttpRequest();
        xhr.open("delete", REST_SERVER_ADDRESS + "/api/v1/user/private", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorizaion", jwt);
        console.log("비밀번호 : " + passRef.current.value);
        xhr.send("password=" + passRef.current.value);

        console.log(xhr.responseText);
        if (xhr.status !== 200) {
            // 비밀번호 틀렸을 때
            setStep(0);
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 3000)

        } else {
            setJwt(null);
            setUserEmail(null);
            navigate("/settings/deactivated");
            return;
        }
    }

    return (
        <>
            <NavBar />
            {step === 0 &&
                <>
                    <h3>계정이 삭제됩니다.</h3>
                    <div>
                        기타 알아야할 상황들
                    </div>
                    <button className="btn btn-danger" onClick={(evt) => {
                        setStep(1);
                    }}>삭제</button>
                    {error && <div className="alert alert-danger">에러</div>}
                </>
            }

            {step === 1 &&
                <>
                    <h3>비밀번호를 확인합니다.</h3>
                    <small>당신의 계정에 설정된 비밀번호를 입력하세요.</small>
                    <div>
                        {userEmail.endsWith("kakao.user") ?
                            <>
                                <input type="password" style={{ width: 400 }} placeholder="소셜 가입자는 비밀번호를 입력하지 않습니다." disabled />
                            </>
                            :
                            <>
                                <input type="password" placeholder="비밀번호" ref={passRef} />
                            </>
                        }
                    </div>
                    <button className="btn btn-danger" onClick={deactivateHandle}>삭제</button>
                    {error && 
                        <div className="alert alert-danger" role="alert">
                            비밀번호가 일치하지 않습니다.
                        </div>}
                </>
            }
        </>
    );
}

export default DeactivatePage;