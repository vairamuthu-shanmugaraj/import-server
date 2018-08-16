import Head from 'next/head';
import Markdown from 'react-markdown';

import GitHub from '../components/icons/github';

export default class extends React.Component {
  static async getInitialProps({ req, query }) {
    return Object.assign({}, query);
  }

  render() {
    const {contents, org, repo, ref} = this.props;
    const title = `${org}/${repo}`;
    const favicon = `https://github.com/${org}.png`;
    let ghUrl = `https://github.com/${org}/${repo}`;
    if (ref !== 'master') {
      ghUrl += `/tree/${ref}`;
    }
    return (
      <div id="root">
        <Head>
          <title>{title}</title>

          <link rel="shortcut icon" type="image/png" href={favicon} />
        </Head>

        <div id="content">
          <Markdown source={contents} />
        </div>

        <div id="footer">
          <a href={ghUrl}>View on <GitHub className="icon github" /></a>
        </div>

        <style jsx>{`
          #root {
            margin: auto;
            margin-bottom: 100px;
            margin-top: 100px;
            max-width: 650px;
          }
        `}</style>

        <style global jsx>{`
          a {
            text-decoration: none;
          }

          h1 {
            font-size: 32px;
            font-weight: 400;
            text-align: center;
            margin-bottom: 50px;
          }

          h1 a {
            color: #000;
          }

          h2 {
            margin-top: 75px;
            font-size: 24px;
            font-weight: 400;
          }

          h2 code {
            border-radius: 3px;
            background: #000;
            color: #fff;
            font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
            font-size: 13px;
            font-weight: bold;
            white-space: pre-wrap;
            padding: 4px;
          }

          h2 code ::before {
            content: "\`\";
          }

          h2 code ::after {
            content: "\`\";
          }

          p {
            font-size: 14px;
            line-height: 24px
          }

          p a {
            color: #0076FF;
          }

          ul {
            padding: 20px;
            border: 1px solid #eaeaea;
            border-radius: 5px;
            list-style-type: none;
          }

          li {
            font-size: 14px;
            line-height: 24px;
          }

          li::before {
            content:"-";
            margin-right: 10px;
            color: #999;
          }

          li code {
            color: rgb(212, 0, 255);
            font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
            font-size: 13px;
            white-space: pre-wrap;
          }

          li code::before {
            content: "\`\";
          }

          li code::after {
            content: "\`\";
          }

          p code {
            color: rgb(212, 0, 255);
            font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
            font-size: 13px;
            white-space: pre-wrap;
          }

          p code::before {
            content: "\`\";
          }

          p code::after {
            content: "\`\";
          }

          pre {
            padding: 20px;
            border: 1px solid #eaeaea;
            border-radius: 5px;
            margin: 20px 0;
          }

          pre code {
            color: rgb(212, 0, 255);
            font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
            font-size: 13px;
            white-space: pre-wrap;
            line-height: 20px;
          }

          html,
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
          }

          html,
          body,
          body > div:first-child {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          img {
            max-width: 100%;
          }

          .icon {
            height: 1em;
          }
        `}</style>
      </div>
    )
  }
}
