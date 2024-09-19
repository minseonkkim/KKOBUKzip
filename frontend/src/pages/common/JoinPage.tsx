import { Helmet } from "react-helmet-async";
import JoinPageBackground from "../../assets/login_background.jpg";
import { useCallback, useEffect, useState } from "react";
import { usePostcodeSearch } from "../../hooks/usePostcodeSearch";
import ErrorMessage from "../../components/common/join/ErrorMessage";
import { JoinDataType } from "../../types/join";
import { register } from "../../apis/userApi";

// 해야할 것 : 이메일유효성검증
// 해야할 것 : 프로필사진 등록

interface ErrorStateType {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  birthday: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
}

function JoinPage() {
  const { postcodeData, loadPostcodeSearch } = usePostcodeSearch();
  const [data, setData] = useState<JoinDataType>({
    email: "",
    password: "",
    foreignFlag: true,
    name: "",
    nickname: "",
    birthday: "",
    phoneNumber: "",
    address: "",
    // detailedAddress: "",
  });
  const [detailedAddress, setDetailAddress] = useState("");

  const [birth, setBirth] = useState<{
    y: number | null;
    m: number | null;
    d: number | null;
  }>({ y: null, m: null, d: null });

  const [phoneNumber, setPhoneNumber] = useState<{
    first: string | null;
    second: string | null;
    third: string | null;
  }>({
    first: null,
    second: null,
    third: null,
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errStat, setErrStat] = useState<ErrorStateType>({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    birthday: "",
    phoneNumber: "",
    address: "",
    detailedAddress: "",
  });

  useEffect(() => {
    if (postcodeData?.jibunAddress) {
      setData((prev) => ({
        ...prev,
        address: postcodeData.jibunAddress,
      }));
    }
  }, [postcodeData?.jibunAddress]);

  const onChangeHandle =
    (key: keyof JoinDataType) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [key]: evt.target.value }));
    };

  const loadDaumPostcodeScript = useCallback(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadDaumPostcodeScript();
  }, [loadDaumPostcodeScript]);

  const handleChangeKorean = (tf: boolean) => {
    setData((prev) => ({ ...prev, foreignFlag: tf }));
  };

  const handleChangeBirth = (
    evt: React.ChangeEvent<HTMLInputElement>,
    type: "y" | "m" | "d"
  ) => {
    const value = evt.target.value;
    setBirth((prev) => ({ ...prev, [type]: parseInt(value) }));
  };

  const changeAddress =
    (type: "address" | "detailedAddress") =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setData((prev) => ({ ...prev, [type]: value }));
    };

  const confirmPasswordChangeHandle = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(evt.target.value);

    if (data.password !== evt.target.value) {
      setErrStat((prev) => ({
        ...prev,
        passwordConfirm: "비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setErrStat((prev) => ({ ...prev, passwordConfirm: "" }));
    }
    console.log(errStat);
  };

  const handleChangePhoneNumber =
    (type: "first" | "second" | "third") =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const value = evt.target.value;
      setPhoneNumber((prev) => ({ ...prev, [type]: value }));
    };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const validateBirthday = (
    y: number | null,
    m: number | null,
    d: number | null
  ) => {
    if (!y || !m || !d) return false;
    const date = new Date(y, m - 1, d);

    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  };

  const validatePhoneNumber = (
    first: string | null,
    second: string | null,
    third: string | null
  ) => {
    return (
      first &&
      second &&
      third &&
      first.toString().length === 3 &&
      second.toString().length === 4 &&
      third.toString().length === 4
    );
  };

  // 회원가입 요청 함수
  const handleJoinSubmit = async () => {
    let isValid = true;
    const newErrStat: ErrorStateType = {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      nickname: "",
      birthday: "",
      phoneNumber: "",
      address: "",
      detailedAddress: "",
    };

    if (!validateEmail(data.email)) {
      newErrStat.email = "유효한 이메일 주소를 입력해주세요.";
      isValid = false;
    }

    if (!validatePassword(data.password)) {
      newErrStat.password =
        "비밀번호는 8자 이상이며, 특수문자를 포함해야 합니다.";
      isValid = false;
    }

    if (data.name.trim().length === 0) {
      newErrStat.name = "이름을 입력해주세요.";
      isValid = false;
    }

    if (data.nickname.trim().length === 0) {
      newErrStat.nickname = "닉네임을 입력해주세요.";
      isValid = false;
    }

    if (!validateBirthday(birth.y, birth.m, birth.d)) {
      newErrStat.birthday = "올바른 생년월일을 입력해주세요.";
      isValid = false;
    }

    if (
      !validatePhoneNumber(
        phoneNumber.first,
        phoneNumber.second,
        phoneNumber.third
      )
    ) {
      newErrStat.phoneNumber = "올바른 전화번호를 입력해주세요.";
      isValid = false;
    }

    if (data.address.trim().length === 0) {
      newErrStat.address = "주소를 입력해주세요.";
      isValid = false;
    }

    if (detailedAddress.trim().length === 0) {
      newErrStat.detailedAddress = "상세 주소를 입력해주세요.";
      isValid = false;
    }

    setErrStat(newErrStat);

    if (isValid) {
      console.log("회원가입 성공!", data);
      // TODO: API 호출 또는 다음 단계로 진행

      await register({
        ...data,
        address: data.address + " " + detailedAddress,
      });
    } else {
      console.log("회원가입 실패. 입력값을 확인해주세요.");
    }
  };

  return (
    <>
      <Helmet>
        <title>꼬북ZIP: 회원가입</title>
      </Helmet>
      <div className="relative justify-center items-center flex min-h-screen w-full">
        <img
          src={JoinPageBackground}
          draggable={false}
          className="w-full h-full object-cover min-h-screen absolute select-none"
          alt="회원가입 배경화면"
        />
        <div className="relative w-3/5  px-16 bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg z-10">
          <div className="w-full m-auto">
            <h2 className="text-4xl font-bold text-center mb-6">회원가입</h2>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
                handleJoinSubmit();
              }}
              className="grid grid-cols-1 space-y-4"
            >
              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">이메일</span>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={onChangeHandle("email")}
                    placeholder="이메일을 입력해주세요"
                    aria-required="true"
                    aria-label="이메일을 입력해주세요"
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.email && <ErrorMessage msg={errStat.email} />}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">비밀번호</span>
                  <input
                    type="password"
                    id="password"
                    value={data.password}
                    onChange={onChangeHandle("password")}
                    autoComplete="off"
                    maxLength={20}
                    size={20}
                    aria-required="true"
                    aria-invalid="false"
                    placeholder="비밀번호를 입력해주세요"
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.password && <ErrorMessage msg={errStat.password} />}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">비밀번호 확인</span>
                  <input
                    type="password"
                    id="password2"
                    value={confirmPassword}
                    onChange={confirmPasswordChangeHandle}
                    autoComplete="off"
                    maxLength={20}
                    size={20}
                    aria-required="true"
                    aria-invalid="false"
                    placeholder="비밀번호를 입력해주세요"
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.passwordConfirm && (
                  <ErrorMessage msg={errStat.passwordConfirm} />
                )}
              </div>

              <div className="flex items-center">
                <span className="w-1/3 font-medium">내국인 여부</span>
                <label className="flex items-center cursor-pointer relative pl-6">
                  <input
                    type="radio"
                    name="option"
                    checked={!data.foreignFlag}
                    onChange={() => handleChangeKorean(false)}
                    className="absolute opacity-0 cursor-pointer"
                  />
                  <span
                    className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
                      data.foreignFlag === false
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {data.foreignFlag === false && (
                      <span className="block w-3 h-3 rounded-full bg-white mx-auto mt-1 transition-transform duration-300"></span>
                    )}
                  </span>
                  <span className="ml-3">한국인</span>
                </label>

                <label className="flex items-center cursor-pointer relative pl-6">
                  <input
                    type="radio"
                    name="option"
                    checked={data.foreignFlag}
                    onChange={() => handleChangeKorean(true)}
                    className="absolute opacity-0 cursor-pointer"
                  />
                  <span
                    className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
                      data.foreignFlag === true
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {data.foreignFlag === true && (
                      <span className="block w-3 h-3 rounded-full bg-white mx-auto mt-1 transition-transform duration-300"></span>
                    )}
                  </span>
                  <span className="ml-3">외국인</span>
                </label>
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">성명</span>
                  <input
                    type="text"
                    placeholder="성명을 입력해주세요."
                    value={data.name}
                    onChange={onChangeHandle("name")}
                    aria-required="true"
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.name && <ErrorMessage msg={errStat.name} />}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">닉네임</span>
                  <input
                    type="text"
                    value={data.nickname}
                    onChange={onChangeHandle("nickname")}
                    aria-required="true"
                    placeholder="닉네임을 입력해주세요."
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.nickname && <ErrorMessage msg={errStat.nickname} />}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">생년월일</span>
                  <div className="w-2/3 flex justify-between">
                    <div className="w-4/12 flex items-center">
                      <input
                        type="number"
                        value={birth.y ?? ""}
                        onChange={(evt) => handleChangeBirth(evt, "y")}
                        placeholder="YYYY"
                        maxLength={4}
                        size={4}
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 mr-1 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      년
                    </div>
                    <div className="w-3/12 flex items-center">
                      <input
                        type="number"
                        value={birth.m ?? ""}
                        onChange={(evt) => handleChangeBirth(evt, "m")}
                        placeholder="MM"
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 mr-1 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      월
                    </div>
                    <div className="w-3/12 flex items-center">
                      <input
                        type="number"
                        value={birth.d ?? ""}
                        onChange={(evt) => handleChangeBirth(evt, "d")}
                        placeholder="DD"
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 mr-1 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      일
                    </div>
                  </div>
                </div>
                {errStat.birthday && <ErrorMessage msg={errStat.birthday} />}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">연락처</span>
                  <div className="w-2/3 flex justify-between items-center">
                    <div className="w-3/12 flex items-center">
                      <input
                        type="number"
                        value={phoneNumber.first ?? ""}
                        onChange={handleChangePhoneNumber("first")}
                        placeholder="010"
                        maxLength={3}
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    -
                    <div className="w-3/12 flex items-center">
                      <input
                        type="number"
                        value={phoneNumber.second ?? ""}
                        onChange={handleChangePhoneNumber("second")}
                        placeholder="0000"
                        maxLength={4}
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    -
                    <div className="w-3/12 flex items-center">
                      <input
                        type="number"
                        value={phoneNumber.third ?? ""}
                        onChange={handleChangePhoneNumber("third")}
                        placeholder="0000"
                        maxLength={4}
                        aria-required="true"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        inline px-3 py-2 border rounded w-full bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
                {errStat.phoneNumber && (
                  <ErrorMessage msg={errStat.phoneNumber} />
                )}
              </div>

              <div>
                <div className="flex items-center">
                  <span className="w-1/3 font-medium">주소</span>
                  <div className="w-2/3 flex">
                    <input
                      type="text"
                      id="address"
                      onChange={changeAddress("address")}
                      value={data.address}
                      placeholder="주소를 검색해주세요."
                      className="flex-grow min-w-0 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      className="flex-none hover:bg-gray-100 px-2 items-center transition-all duration-300 ease-in-out bg-gray-50 border py-2 ml-1.5 rounded"
                      onClick={loadPostcodeSearch}
                    >
                      찾기
                    </button>
                  </div>
                </div>
                {errStat.address && <ErrorMessage msg={errStat.address} />}
                <div className="mt-3">
                  <div className="w-1/3 inline-block" />
                  <input
                    type="text"
                    id="addressDetail"
                    value={detailedAddress}
                    onChange={(evt) => setDetailAddress(evt.target.value)}
                    placeholder="상세주소를 입력해주세요."
                    className="w-2/3 px-3 py-2 border rounded bg-gray-50/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errStat.detailedAddress && (
                  <ErrorMessage msg={errStat.detailedAddress} />
                )}
              </div>

              <button
                type="submit"
                className="bg-green-500 flex-shrink text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
              >
                회원가입
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinPage;
