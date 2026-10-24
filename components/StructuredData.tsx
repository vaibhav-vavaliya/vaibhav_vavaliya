import { badges, experience, profile } from '@/data/profile';

/**
 * schema.org JSON-LD: tells search engines this site is the profile page of the person
 * Vaibhav Vavaliya, and that the GitHub and LinkedIn accounts are the same person.
 */
export function StructuredData() {
  const url = `${profile.siteUrl}/`;
  const person = `${profile.siteUrl}/#person`;
  const job = experience[0];

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': person,
        name: profile.fullName,
        givenName: 'Vaibhav',
        familyName: 'Vavaliya',
        alternateName: [profile.name, 'vaibhav-vavaliya'],
        url,
        image: `${profile.siteUrl}/og.png`,
        jobTitle: 'Full Stack & Backend Developer',
        description: profile.tagline,
        email: `mailto:${profile.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Surat', addressRegion: 'Gujarat', addressCountry: 'IN' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'P P Savani University' },
        hasOccupation: {
          '@type': 'Occupation',
          name: job.role,
          occupationLocation: { '@type': 'City', name: 'Surat' },
          skills: job.stack.join(', '),
        },
        knowsAbout: badges.filter((b) => b.tier !== 'locked').map((b) => b.name),
        knowsLanguage: profile.spoken,
        sameAs: profile.links.map((l) => l.href),
      },
      {
        '@type': 'WebSite',
        '@id': `${profile.siteUrl}/#website`,
        url,
        name: profile.fullName,
        alternateName: [`${profile.fullName} Portfolio`, profile.name],
        inLanguage: 'en',
        author: { '@id': person },
        publisher: { '@id': person },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profilepage`,
        url,
        name: `${profile.fullName} · Full Stack & Backend Developer`,
        isPartOf: { '@id': `${profile.siteUrl}/#website` },
        mainEntity: { '@id': person },
        dateModified: new Date().toISOString(),
        inLanguage: 'en',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // `<` is escaped so the JSON can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  );
}
