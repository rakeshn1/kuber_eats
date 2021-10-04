import React from "react";
import "./Proposion-type.css";
import { Container } from "../../../Container/Container";

export class PropositionType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: props.restaurantMenu.sections,
      categoriesInButton: [],
      changing: false,
      isModalOpened: false
    };
  }

  ulList = React.createRef();
  closeOther = e => {
    const isOtherTypeButton = e.target.matches(
      ".Proposition-type__other-button"
    );

    if (!isOtherTypeButton) {
      this.setState({
        isModalOpened: false
      });
    }
  };
  componentDidMount() {
    this.checkWidth();
    window.addEventListener("click", this.closeOther);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.closeOther);
  }

  checkWidth = () => {
    if (this.ulList.current.offsetWidth > 1000) {
      this.setState(function(state) {
        let oldSection = this.state.sections;
        let addToButton = this.state.categoriesInButton;
        addToButton.push(oldSection.pop());
        console.log(this.ulList.current.offsetWidth);
        setTimeout(this.checkWidth, 0);

        return {
          sections: [...oldSection],
          categoriesInButton: [...addToButton],
          changing: true
        };
      });
    } else if (this.state.changing) {
      console.log("гуси");
      this.setState(function(state) {
        let oldSection = this.state.sections;
        let addToButton = this.state.categoriesInButton;
        addToButton.push(oldSection.pop());
        addToButton.reverse();
        return {
          sections: [...oldSection],
          categoriesInButton: [...addToButton]
        };
      });
    }
  };

  openModal = () => {
    this.setState({
      isModalOpened: !this.state.isModalOpened
    });
  };

  render() {
    return (
      <section className="Proposition-type">
        <Container>
          <div className="Proposition-type__wrapper">
            <ul ref={this.ulList} className="Proposition-type__list">
              <div className={"Proposition-type__main-list"}>
                {this.state.sections.map((section, i) => {
                  return (
                    <a
                      href={`#${section.title}`}
                      className={"Proposition-type__link"}
                      key={section.title}
                    >
                      <li className="Proposition-type__item">
                        {section.title}
                      </li>
                    </a>
                  );
                })}
              </div>
            </ul>
            {this.state.changing && (
              <button
                onClick={this.openModal}
                className={"Proposition-type__other-button"}
              >
                Other ⯆
              </button>
            )}
            {this.state.isModalOpened && (
              <div className={"Proposition-type__other"}>
                {this.state.categoriesInButton.map(categorie => {
                  return (
                    <a
                      href={`#${categorie.title}`}
                      className={"Proposition-type__other-link"}
                      key={categorie.title}
                    >
                      <div className="Proposition-type__other-item">
                        {categorie.title}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  }
}
