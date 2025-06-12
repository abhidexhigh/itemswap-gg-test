import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import titleShape from "@assets/images/icons/steps.png";
import one from "@assets/image/banners/1.webp";
import PageHeaderStyleWrapper from "./PageHeader.style";
const PageHeader = ({ currentPage, pageTitle }) => {
  const { t } = useTranslation();
  const others = t("others");
  return (
    <PageHeaderStyleWrapper>
      <div
        style={{
          backgroundImage: `url(${one})`,
        }}
        className="bg-center bg-no-repeat bg-cover pt-20 pb-[70px] px-0"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="breadcrumb_area">
                <div className="breadcrumb_menu">
                  <Link href="/" className="!text-[#fff]">
                    {others?.home} <span>.</span>{" "}
                    {currentPage &&
                      others?.[
                        currentPage
                          .toLowerCase()
                          .replace(/\s(.)/g, function (a) {
                            return a.toUpperCase();
                          })
                          .replace(/\s/g, "")
                          .replace(/^(.)/, function (b) {
                            return b.toLowerCase();
                          })
                      ]}
                  </Link>
                  <img
                    className="heading_shape"
                    src={titleShape.src}
                    alt="shape"
                  />
                </div>
                <h2 className="breadcrumb_title text-uppercase">
                  {pageTitle &&
                    others?.[
                      currentPage
                        .toLowerCase()
                        .replace(/\s(.)/g, function (a) {
                          return a.toUpperCase();
                        })
                        .replace(/\s/g, "")
                        .replace(/^(.)/, function (b) {
                          return b.toLowerCase();
                        })
                    ]}
                </h2>
              </div>
            </div>

            {/* <div className="col-lg-7">
            <div className="breadcrumb_form">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  id="Search"
                  name="search"
                  placeholder="Search by name, token, address"
                />
                <button>
                  <FiSearch />
                </button>
              </form>
              <Button sm variant="dark" href="/project-calendar">
                <BiCalendar />
                Calender
              </Button>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </PageHeaderStyleWrapper>
  );
};

export default PageHeader;
