import type { ProjectWithEmployees } from "~/api/projects";

export const MOCK_PROJECTS: ProjectWithEmployees[] = [
  {
    id: 8,
    name: "Composure",
    description:
      "Sleep is a basic, human need and a significant part of maintaining our well-being. When we get a good night’s rest we focus better, eat better, and live with greater energy and resilience.",
    color: "gray-100",
    type: "internal",
    startDate: "2024-01-25",
    endDate: "2025-02-21",
    createdAt: "2024-01-25T18:34:31.000000Z",
    status: "active",
    notes: "",
    employees: [],
    accountManager: {
      id: 1,
      name: "Martin Oppenheimer",
      email: "martin@lightit.io",
      hours: 8,
      avatarUrl: "https://via.placeholder.com/100x100.png/00ee77?text=ut",
      jobTitle: "Generated by Seeder",
      isAssignable: false,
      hireDate: "2024-01-25T03:00:00.000000Z",
      availableHours: 8,
    },
    techLead: {
      id: 26,
      name: "Andrés Nakanishi",
      email: "andres.nakanishi@lightit.io",
      hours: 8,
      avatarUrl:
        "https://light-it-onboarding.sfo3.digitaloceanspaces.com/avatars/avatar-26.jpg",
      jobTitle: "Vendedor de estupefacientes",
      isAssignable: true,
      hireDate: "2023-08-15T03:00:00.000000Z",
      availableHours: 8,
    },
    projectManager: {
      id: 75,
      name: "Adam Holt",
      email: "adamh@efficientoffice.com",
      hours: 8,
      avatarUrl: "/images/photo_person_150x150.png",
      jobTitle: "Technical Recruiter",
      isAssignable: true,
      hireDate: "2022-12-15T03:00:00.000000Z",
      availableHours: 8,
    },
    client: {
      id: 1,
      name: "light-it",
      thumbnail:
        "https://intranet.stage.lightitlabs.com/assets/lightit-logo-violet-2af2ff7b.svg",
      address:
        "20900 NE 30 Ave, suite 200-27, ZIP 33180, Aventura, Florida, United States",
      phoneNumber: "+1 917-905-6067",
      email: "martin@lightit.io",
      createdAt: "2024-01-25T18:34:31.000000Z",
      updatedAt: "",
      projectsCount: 0,
    },
    technologies: [
      {
        id: 2,
        name: "Bluesound Professional",
        description:
          "Bluesound Professional is a fusion of hardware and software that is purpose-built for high-performance networked audio.",
        colors: {
          text: "white",
          border: "",
          background: "gray-800",
        },
        url: "https://www.bluesoundprofessional.com",
        version: "",
      },
      {
        id: 3,
        name: "React",
        description:
          "React is a JavaScript library for building user interfaces, focusing on component-based development.",
        colors: {
          text: "white",
          border: "",
          background: "red-100",
        },
        url: "https://reactjs.org",
        version: "",
      },
    ],
    integrations: [],
    utilities: [
      {
        id: 1,
        name: "Production",
        url: "",
      },
      {
        id: 2,
        name: "Staging",
        url: "",
      },
      {
        id: 3,
        name: "Develop",
        url: "",
      },
    ],
  },
  {
    id: 30,
    name: "Eclair - Proposal maker",
    description:
      "An text editor which can be used in a whole document detailing prices, estimated hours, scopes, whatever the project wants and needs",
    color: "green-200",
    type: "client",
    startDate: "2024-01-25",
    endDate: "",
    createdAt: "2024-01-25T18:34:32.000000Z",
    status: "paused",
    notes: "",
    employees: [],
    accountManager: {
      id: 1,
      name: "Martin Oppenheimer",
      email: "martin@lightit.io",
      hours: 8,
      avatarUrl: "https://via.placeholder.com/100x100.png/00ee77?text=ut",
      jobTitle: "Generated by Seeder",
      isAssignable: false,
      hireDate: "2024-01-25T03:00:00.000000Z",
      availableHours: 8,
    },
    techLead: {
      id: 26,
      name: "Andrés Nakanishi",
      email: "andres.nakanishi@lightit.io",
      hours: 8,
      avatarUrl:
        "https://light-it-onboarding.sfo3.digitaloceanspaces.com/avatars/avatar-26.jpg",
      jobTitle: "Vendedor de estupefacientes",
      isAssignable: true,
      hireDate: "2023-08-15T03:00:00.000000Z",
      availableHours: 8,
    },
    projectManager: {
      id: 75,
      name: "Adam Holt",
      email: "adamh@efficientoffice.com",
      hours: 8,
      avatarUrl: "/images/photo_person_150x150.png",
      jobTitle: "Technical Recruiter",
      isAssignable: true,
      hireDate: "2022-12-15T03:00:00.000000Z",
      availableHours: 8,
    },
    client: {
      id: 1,
      name: "light-it",
      thumbnail:
        "https://intranet.stage.lightitlabs.com/assets/lightit-logo-violet-2af2ff7b.svg",
      address:
        "20900 NE 30 Ave, suite 200-27, ZIP 33180, Aventura, Florida, United States",
      phoneNumber: "+1 917-905-6067",
      email: "martin@lightit.io",
      createdAt: "2024-01-25T18:34:31.000000Z",
      updatedAt: "",
      projectsCount: 0,
    },
    technologies: [
      {
        id: 6,
        name: "Nuxtjs",
        description:
          "Nuxt.js is a framework built on top of Vue.js for creating universal Vue applications.",
        colors: {
          text: "white",
          border: "",
          background: "green-300",
        },
        url: "https://nuxtjs.org",
        version: "",
      },
      {
        id: 25,
        name: "Docker",
        description:
          "Docker is a software platform that allows you to build, test, and deploy applications quickly.",
        colors: {
          text: "white",
          border: "",
          background: "green-600",
        },
        url: "https://www.docker.com/",
        version: "",
      },
    ],
    integrations: [],
    utilities: [],
  },
  {
    id: 9,
    name: "EO Care",
    description:
      "EO Care is a healthcare platform, dedicated to providing patients suffering from anxiety, pain, or sleep problems with a care plan based on the use of cannabis-based products.",
    color: "gray-200",
    type: "client",
    startDate: "2024-01-25",
    endDate: "",
    createdAt: "2024-01-25T18:34:31.000000Z",
    status: "archived",
    notes: "",
    employees: [],
    accountManager: {
      id: 1,
      name: "Martin Oppenheimer",
      email: "martin@lightit.io",
      hours: 8,
      avatarUrl: "https://via.placeholder.com/100x100.png/00ee77?text=ut",
      jobTitle: "Generated by Seeder",
      isAssignable: false,
      hireDate: "2024-01-25T03:00:00.000000Z",
      availableHours: 8,
    },
    techLead: {
      id: 26,
      name: "Andrés Nakanishi",
      email: "andres.nakanishi@lightit.io",
      hours: 8,
      avatarUrl:
        "https://light-it-onboarding.sfo3.digitaloceanspaces.com/avatars/avatar-26.jpg",
      jobTitle: "Vendedor de estupefacientes",
      isAssignable: true,
      hireDate: "2023-08-15T03:00:00.000000Z",
      availableHours: 8,
    },
    projectManager: {
      id: 75,
      name: "Adam Holt",
      email: "adamh@efficientoffice.com",
      hours: 8,
      avatarUrl: "/images/photo_person_150x150.png",
      jobTitle: "Technical Recruiter",
      isAssignable: true,
      hireDate: "2022-12-15T03:00:00.000000Z",
      availableHours: 8,
    },
    client: {
      id: 1,
      name: "light-it",
      thumbnail:
        "https://intranet.stage.lightitlabs.com/assets/lightit-logo-violet-2af2ff7b.svg",
      address:
        "20900 NE 30 Ave, suite 200-27, ZIP 33180, Aventura, Florida, United States",
      phoneNumber: "+1 917-905-6067",
      email: "martin@lightit.io",
      createdAt: "2024-01-25T18:34:31.000000Z",
      updatedAt: "",
      projectsCount: 0,
    },
    technologies: [
      {
        id: 11,
        name: "nodejs",
        description:
          "Node.js is a single-threaded, open-source, cross-platform runtime environment for building fast and scalable server-side and networking applications.",
        colors: {
          text: "white",
          border: "",
          background: "blue-800",
        },
        url: "https://nodejs.org/en",
        version: "",
      },
      {
        id: 16,
        name: "Jotform",
        description:
          "JotForm is a freemium web/app-based tool that helps users create forms online without any coding involved.",
        colors: {
          text: "white",
          border: "",
          background: "blue-300",
        },
        url: "https://www.jotform.com/",
        version: "",
      },
    ],
    integrations: [],
    utilities: [],
  },
  {
    id: 28,
    name: "Felix",
    description:
      "Online prescriptions are about more than convenience. By introducing a new model of care, Felix is on a mission to change behaviours, attitudes, and conventions around personal health in Canada.",
    color: "green-200",
    type: "client",
    startDate: "2024-01-25",
    endDate: "",
    createdAt: "2024-01-25T18:34:32.000000Z",
    status: "active",
    notes: "",
    employees: [],
    accountManager: {
      id: 1,
      name: "Martin Oppenheimer",
      email: "martin@lightit.io",
      hours: 8,
      avatarUrl: "https://via.placeholder.com/100x100.png/00ee77?text=ut",
      jobTitle: "Generated by Seeder",
      isAssignable: false,
      hireDate: "2024-01-25T03:00:00.000000Z",
      availableHours: 8,
    },
    techLead: {
      id: 26,
      name: "Andrés Nakanishi",
      email: "andres.nakanishi@lightit.io",
      hours: 8,
      avatarUrl:
        "https://light-it-onboarding.sfo3.digitaloceanspaces.com/avatars/avatar-26.jpg",
      jobTitle: "Vendedor de estupefacientes",
      isAssignable: true,
      hireDate: "2023-08-15T03:00:00.000000Z",
      availableHours: 8,
    },
    projectManager: {
      id: 75,
      name: "Adam Holt",
      email: "adamh@efficientoffice.com",
      hours: 8,
      avatarUrl: "/images/photo_person_150x150.png",
      jobTitle: "Technical Recruiter",
      isAssignable: true,
      hireDate: "2022-12-15T03:00:00.000000Z",
      availableHours: 8,
    },
    client: {
      id: 1,
      name: "light-it",
      thumbnail:
        "https://intranet.stage.lightitlabs.com/assets/lightit-logo-violet-2af2ff7b.svg",
      address:
        "20900 NE 30 Ave, suite 200-27, ZIP 33180, Aventura, Florida, United States",
      phoneNumber: "+1 917-905-6067",
      email: "martin@lightit.io",
      createdAt: "2024-01-25T18:34:31.000000Z",
      updatedAt: "",
      projectsCount: 0,
    },
    technologies: [
      {
        id: 1,
        name: "Laravel",
        description:
          "Laravel is a PHP framework known for its elegant syntax and feature-rich ecosystem.",
        colors: {
          text: "white",
          border: "",
          background: "gray-100",
        },
        url: "https://laravel.com",
        version: "",
      },
    ],
    integrations: [],
    utilities: [],
  },
];