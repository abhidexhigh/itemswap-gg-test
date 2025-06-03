import React from "react";

class JSONWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { name: "John", age: 30, city: "New York" },
    };
  }

  writeJSONToFile = () => {
    const data = JSON.stringify(this.state.data, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  render() {
    return (
      <div>
        <button onClick={this.writeJSONToFile}>Write JSON to File</button>
      </div>
    );
  }
}

export default JSONWriter;
