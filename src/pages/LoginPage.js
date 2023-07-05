import { useRef } from "react";
import { REST_SERVER_ADDRESS } from "../common/Constant";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "..";
import NavBar from "../component/NavBar";

function LoginPage() {

    // 필요한 훅 설정
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);
    const formRef = useRef();
    const navigate = useNavigate();

    // 팝업에서 메세지 이벤트 발생시켰을 떄
    window.onmessage = (evt) => {
        console.log(evt.data.type);
        if (evt.data.type === "kakaoAuth") {
            setJwt(evt.data.jwtToken);
            setUserEmail(evt.data.userEmail);
            navigate("/home");
        }
    }

    const loginFormHandle = (evt) => {
        evt.preventDefault();

        const email = formRef.current.email.value;
        const password = formRef.current.password.value;

        if (email === "" || password === "") {
            window.alert("이메일과 비밀번호를 모두 입력 해 주세요");
            formRef.current.email.focus();
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/validate", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send("email=" + email + "&password=" + password);

        if (xhr.status === 200) {
            window.alert(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            // window.alert(response.token);
            setJwt(response.token);
            sessionStorage.setItem("authToken", response.token);
            setUserEmail(response.userEmail);
            sessionStorage.setItem("authUserEmail", response.userEmail);
            navigate("/home");
        } else if (xhr.status === 400) {
            window.alert("[상태코드] : " + xhr.status + " / 해당 이메일이 존재하지 않습니다.");
            formRef.current.email.classList.add("is-invalid");
            formRef.current.password.value = "";
            formRef.current.email.focus();
        } else {
            window.alert("[상태코드] : " + xhr.status + " / 비밀번호가 일치하지 않습니다.");
            formRef.current.email.classList.add("is-valid");
            formRef.current.password.classList.add("is-invalid");
            formRef.current.password.value = "";
            formRef.current.password.focus();
        }
    }

    // 카카오 로그인 클릭시
    const kakaoLoginHandle = (evt) => {
        const xhr = new XMLHttpRequest();
        xhr.open("get", REST_SERVER_ADDRESS + "/api/v1/oauth/kakao", false);
        xhr.send();
        const response = JSON.parse(xhr.responseText);

        var _width = 600;
        var _height = 800;
        var _left = Math.ceil((window.screen.width - _width) / 2);
        var _top = Math.ceil((window.screen.height - _height) / 2);

        window.open(response.authUri, "_blank", 'width=' + _width + ', height=' + _height + ', left=' + _left + ', top=' + _top);
    }

    return (
        <>
            <NavBar />
            <div className="container mt-5 pt-5">
                <h3># 로그인 페이지</h3>
                <hr />
                <form onSubmit={loginFormHandle} ref={formRef}>
                    <div className="mb-3">
                        <span>사용자 이메일 ( * )</span>
                        <input type="text" placeholder="이메일" name="email" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <span>비밀번호 ( * )</span>
                        <input type="password" placeholder="비밀번호" name="password" className="form-control" />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="form-control">로그인</button>
                    </div>
                    <div className="mb-3">
                        <button type="button" className="form-control" style={{ backgroundColor: "yellow" }}
                            onClick={kakaoLoginHandle}>카카오로 로그인하기</button>
                    </div>
                </form>
                <div className="text-center">
                    계정이 없으신가요? <Link to="/flow/signup" style={{ textDecoration: "none" }}>회원가입</Link>
                </div>
            </div>
        </>
    );
}

export default LoginPage;