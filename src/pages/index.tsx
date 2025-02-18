import * as React from 'react';
import { useEffect, useState } from 'react';
import type { PageProps } from 'gatsby';
import { graphql } from 'gatsby';

import '../styles/pages/s_index.scss';
import { Separator } from '@radix-ui/react-separator';
import { startCase } from 'lodash';
import Header, { IContact } from '../components/header';
import mapWorks, { IWork } from '../util/page/IndexUtils';
import Footer from '../components/footer';
import PageBody from '../components/pageBody';
import RoleSelector from '../components/roleSelector';

export const query = graphql`
  query Index {
    infoResults: allContentfulPersonalInfo(limit: 1) {
      nodes {
        firstName
        lastName
        email
        phoneNumber
        portraitVideo {
          file {
            url
          }
        }
      }
    }
    tabOrderResults: allContentfulTabOrder(limit: 1) {
      nodes {
        tabOrder
      }
    }
    workResults: allContentfulWork(sort: { datePublished: DESC }) {
      nodes {
        id
        roles
        name
        datePublished
        description
        previewVideo {
          file {
            url
          }
        }
        previewImage {
          image: gatsbyImageData(layout: CONSTRAINED)
        }
        link
      }
    }
  }
`;

export default function IndexPage({
  data: { infoResults, tabOrderResults, workResults },
  location: { hash },
}: PageProps<Queries.IndexQuery>) {
  const info: IContact = infoResults.nodes[0] as IContact;
  const works: IWork[] = workResults.nodes.filter((i): i is IWork => {
    return typeof i === 'object';
  });
  const rolesToWorks: Record<string, IWork[]> = mapWorks(works);
  // TODO: Fix hardcoded keys
  const { tabOrder } = tabOrderResults.nodes[0];
  const tabs = (tabOrder ?? []).filter((e) => e !== null);
  // @ts-ignore
  // const rolesSet: Set<string> = new Set(tabs);
  // works.forEach((work) => work.roles.forEach((role) => rolesSet.add(role)));
  const roles: string[] = Array.from(tabs);

  const pageRole = startCase(hash.replace('#', '').replace('-', ' '));
  const [activeRole, setActiveRole] = useState(
    rolesToWorks.hasOwnProperty(pageRole) ? pageRole : roles[0]
  );

  useEffect(() => {
    if (rolesToWorks.hasOwnProperty(pageRole)) {
      setActiveRole(pageRole);
    }
  }, [hash]);

  const pageWorks = rolesToWorks[activeRole];

  return (
    <div className="site-container">
      <title>{`${info.firstName} portfolio`}</title>
      <Header info={info} />
      <Separator className="separator" />
      <RoleSelector roles={roles} active={activeRole} />
      <PageBody works={pageWorks} />
      <div className="footer">
        <Footer url={info.portraitVideo.file.url} />
      </div>
    </div>
  );
}
