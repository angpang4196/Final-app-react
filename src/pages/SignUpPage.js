import { useRef, useState } from "react";
import { REST_SERVER_ADDRESS } from "../common/Constant";
import { useNavigate } from "react-router-dom";
import NavBar from "../component/NavBar";

/*
    회원가입 UI  - /flow/signup
*/
function SignupPage() {
    const [availalbeFlag, setAvailableFlag] = useState(0);
    const formRef = useRef();
    const emailRef = useRef();
    const verifyBtnRef = useRef();

    const navigate = useNavigate();

    // 이벤트 처리 코드 ========================================================================
    // 사용자가 이메일 입력란에 값 입력시 사용가능한지 API 통신 처리
    const emailChangeHandle = (evt) => {
        // console.log(evt.target.value);
        if (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(evt.target.value)) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET",
                REST_SERVER_ADDRESS + "/api/v1/user/available?email=" + formRef.current.email.value, false);
            xhr.send();
            // window.alert(xhr.status);
            if (xhr.status === 200) {
                verifyBtnRef.current.disabled = false;
                setAvailableFlag(1);
            } else {
                verifyBtnRef.current.disabled = true;
                setAvailableFlag(-1);
            }
        } else {
            verifyBtnRef.current.disabled = true;
            setAvailableFlag(0);
        }
        // verifyBtnRef.current.disabled = !(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(evt.target.value));
    }

    // 사용자가 이메일 인증코드를 요청시, 메일을 발송시키는 API를 호출 
    const verfiyBtnClickHandle = (evt) => {
        // API로 요청을 하면 됨. 
        console.log("!!!!!");
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/verify-email", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + formRef.current.email.value);
        console.log(xhr.responseText);
        setAvailableFlag(2);
    }


    // 사용자가 인증코드 입력후 엔터 눌렀을 때, 인증코드 검증처리를 하는 API를 호출
    const codeSubmitHandle = (evt) => {
        if (evt.keyCode !== 13) {
            return;
        }
        evt.preventDefault();

        // API로 요청을 하면 됨. 
        console.log("!!!!!");
        const xhr = new XMLHttpRequest();
        xhr.open("PATCH", REST_SERVER_ADDRESS + "/api/v1/user/verify-email", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + formRef.current.email.value + "&code=" + evt.target.value);

        if (xhr.status === 200) {
            setAvailableFlag(4);
            emailRef.current.readOnly = true;
            verifyBtnRef.current.disabled = true;
        } else {
            window.alert("인증코드가 일치하지 않습니다.");
        }
    }

    // 사용자가 회원가입을 눌렀을때, 신규유저를 등록하는 API를 호출
    const signupSubmitHandle = (evt) => {
        evt.preventDefault();
        const email = emailRef.current.value;
        const name = formRef.current.name.value;
        const password = formRef.current.password.value;

        if (email === "" || name === "" || password === "" || availalbeFlag !== 4) {
            window.alert("회원가입에 필요한 절차를 통과하지 못했다.");
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/join", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + email + "&name=" + name + "&password=" + password);
        window.alert(xhr.status);
        if (xhr.status === 201) {
            navigate("/flow/login");
        }
    }

    //============================================================================================
    return (
        <>
            <NavBar />
            <div className="container mt-5 pt-5">
                <h3># 계정을 생성하세요</h3>
                <hr />
                <form ref={formRef} onSubmit={signupSubmitHandle} >
                    <p>
                        <span className="form-label">이름</span>
                        <input type="text" placeholder="이름" name="name" className="form-control" required
                            onChange={(evt) => {
                                if (evt.target.value !== "") {
                                    evt.target.classList.add("is-valid");
                                    evt.target.classList.remove("is-invalid");
                                } else {
                                    evt.target.classList.add("is-invalid");
                                    evt.target.classList.remove("is-valid");
                                }
                            }} />
                    </p>
                    <p>
                        <span className="form-label">이메일</span>
                        <input type="text" placeholder="이메일" onChange={emailChangeHandle} required
                            name="email" ref={emailRef} className="form-control" />
                        <button type="button" ref={verifyBtnRef}
                            onClick={verfiyBtnClickHandle}>이메일인증</button>
                    </p>
                    {availalbeFlag === 1 && <p>사용가능한 Email 입니다</p>}
                    {availalbeFlag === -1 && <p>이미 사용중 인  Email 입니다</p>}
                    {availalbeFlag === 2 && <p>
                        <span className="form=label">이메일인증번호</span>
                        <input type="text" placeholder="인증번호" onKeyDown={codeSubmitHandle}
                            className="form-control" />
                    </p>}

                    <p>
                        <span className="form-label">비밀번호</span>
                        <input type="password" placeholder="비밀번호" name="password"
                            className="form-control" required />
                    </p>
                    <p>
                        <button type="submit">가입하기</button>
                    </p>
                </form>
            </div>
        </>
    );
}

export default SignupPage;