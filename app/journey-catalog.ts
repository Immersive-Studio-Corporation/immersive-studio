import { sceneryFor } from './journey-art.ts';

/** Editorial order shared by the tour, navigation, community and footer. */
const identities = [
  {
    id: 'heritage',
    name: 'L’Héritage de Poudlard',
    image: '/images/logos-hd-20260921/heritage.svg',
    color: '#eac998',
  },
  {
    id: 'onepiece',
    name: 'One Piece RP',
    image: '/images/logos-hd-20260921/onepiece.svg',
    color: '#58c7ee',
  },
  {
    id: 'teen',
    name: 'Teen Wolf RP',
    image: '/images/logos-hd-20260921/teen.svg',
    color: '#B0A1DD',
  },
  {
    id: 'percy',
    name: 'Percy Jackson RP',
    image: '/images/logos-hd-20260921/percy.svg',
    color: '#5AACE0',
  },
  {
    id: 'avengers',
    name: 'Avengers RP',
    image: '/images/logos-hd-20260921/avengers.svg',
    color: '#A7BEDD',
  },
  {
    id: 'walkingdead',
    name: 'The Walking Dead RP',
    image: '/images/logos-hd-20260921/walkingdead.svg',
    color: '#B5C289',
  },
  {
    id: 'narnia',
    name: 'Narnia RP',
    image: '/images/logos-hd-20260921/narnia.svg',
    color: '#e4bb6c',
  },
] as const;

export const projectCatalog = identities.map((project) => ({
  ...project,
  scenery: sceneryFor(project.id),
  backdrop: sceneryFor(project.id)[0],
}));
