import { useRecoilValue } from "recoil";
import { jwtState } from "../..";
import { REST_SERVER_ADDRESS } from "../../common/Constant";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../component/NavBar";

function ModifyPasswordPage() {

    const jwt = useRecoilValue(jwtState);
    const oldRef = useRef();
    const newRef = useRef();
    const navigate = useNavigate();

    const modifyPasswordHandle = (evt) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", REST_SERVER_ADDRESS + "/api/v1/user/private/password", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", jwt);
        xhr.send("oldPassword=" + oldRef.current.value + "&newPassword=" + newRef.current.value);
        console.log(xhr.status);
        if (xhr.status === 200) {
            window.alert("비밀번호 변경이 완료되었습니다.");
            navigate("/home");
        }

    }

    return (
        <>
            <NavBar />
            <div className="container">
                <span className="form-label">기존 비밀번호</span>
                <input type="password" placeholder="기존 비밀번호를 입력 해 주세요."
                    ref={oldRef} className="form-control" />

                <span className="form-label">신규 비밀번호</span>
                <input type="password" placeholder="변경할 비밀번호를 입력 해 주세요."
                    ref={newRef} className="form-control" />
            </div>
            <button onClick={modifyPasswordHandle}>비밀번호 변경</button>
        </>
    );
}

export default ModifyPasswordPage;