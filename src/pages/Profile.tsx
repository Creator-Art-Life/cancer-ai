import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context";
import { useEffect } from "react";
import { GoogleIcon } from "../assets/google";
import { UserIcon } from "../assets/user";
import { EmailIcon } from "../assets/email";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components";
import AuthComponent from "@/utils/AuthComponent";
import { Calendar, LucideIcon, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { t } = useTranslation();
  const { currentUser, fetchUserByEmail } = useStateContext();
  const { user } = usePrivy();
  const { authenticated, handleLoginLogout } = AuthComponent();
  const navigate = useNavigate();

  // console.log("user:", user, "currentUser:", currentUser);

  useEffect(() => {
    if (!currentUser) {
      fetchUserByEmail(user?.email?.address ?? "");
    }
  }); // [currentUser, fetchUserByEmail]

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
        <div className="sm:text-4xl text-lg font-bold text-gray-700 mb-2">
          Loading...
        </div>
        <div className="sm:text-xl text-sm text-gray-500 font-semibold">
          If the loading takes too long, please log in to your account.
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
        <div className="sm:text-4xl text-lg font-bold text-gray-700 mb-2">
          Loading...
        </div>
        <div className="sm:text-2xl max-sm:text-xl ml-6  text-gray-500 font-semibold">
          If the loading takes too long, you can{" "}
          <span
            className="font-semibold underline text-blue-500 cursor-pointer"
            onClick={() => navigate("/onboarding")}
          >
            add
          </span>{" "}
          information about you
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg bg-[#1c1c24] p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <p className="mb-4 flex h-20 w-20 flex-row items-center justify-center rounded-full bg-[#0092F3]">
          <span className="text-6xl">😊</span>
        </p>
        <h1 className="mb-2 text-3xl font-semibold text-white">
          {t("user_profile")}
          <a href="/onboarding">
            <p className="text-sm text-gray-600 underline">
              {currentUser ? "Edit" : "Add"} information about you
            </p>
          </a>
        </h1>
        <div className="mt-4 w-full">
          <h1 className="text-white text-2xl font-semibold mb-5">About you:</h1>
          <RowProfile
            Icon={MapPin}
            title={t("Location")}
            content={currentUser.location}
            iconProps={{ color: "#ffffff" }}
          />
          <RowProfile
            Icon={Calendar}
            title={t("Age")}
            content={currentUser.age}
            iconProps={{ color: "#ffffff" }}
          />

          <RowProfile
            Icon={EmailIcon}
            title={t("email")}
            content={user.email?.address}
          />
          <RowProfile
            Icon={UserIcon}
            title={t("CreatedAt_account")}
            content={new Date(user.createdAt).toLocaleString()}
          />
          <RowProfile
            Icon={GoogleIcon}
            title="Google"
            content={user?.google?.name ?? "You login without google"}
          />
        </div>
        <CustomButton
          btnType="button"
          title={authenticated ? "Log Out" : "Log In"}
          styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
          handleClick={handleLoginLogout}
        />
      </div>
    </div>
  );
}

const RowProfile = ({
  Icon,
  title,
  content,
  iconProps,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>> | LucideIcon;
  title: string;
  content: string | undefined | number;
  iconProps?: React.SVGProps<SVGSVGElement>;
}) => {
  return (
    <div
      className={`mb-4 flex flex-col md:flex-row ${
        content && content.toString().length < 10 ? "flex-row" : "flex-col"
      } items-start md:items-center`}
    >
      <div className="flex items-center mb-2 md:mb-0 md:mr-2">
        <Icon {...iconProps} />
        <p className="ml-2 text-xl text-gray-400 font-semibold">{title}:</p>
      </div>
      <p className="text-lg font-medium text-white">
        <span className="inline md:hidden">&nbsp;</span>
        {content}
      </p>
    </div>
  );
};

export default Profile;
1;
