import { useRecoilValue } from "recoil";
import { jwtState } from "..";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../component/NavBar";

function IndexPage() {

    const jwt = useRecoilValue(jwtState);
    const navigate = useNavigate();

    useEffect(() => {
        if (jwt) {
            // navigate("/home");
        }
    })

    return (
        <>
            <NavBar />
            <div className="container mt-5 pt-5">
                <div>
                    <Link to={"/flow/login"} style={{ textDecoration: "none" }}>로그인</Link>
                    <Link to={"/flow/signup"} style={{ margin: 4, textDecoration: "none" }}>회원가입</Link>
                </div>
            </div>
        </>
    );
}

export default IndexPage;