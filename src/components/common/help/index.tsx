import "./index.scss";

export const HelpComponent = () => {
  return <div class="help-component"></div>;
};

export const InfoComponent = ({ children }: { children: any }) => {
  return (
    <table class="info-component">
      <tbody>
        <tr>
          <td>🛈</td>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
};
