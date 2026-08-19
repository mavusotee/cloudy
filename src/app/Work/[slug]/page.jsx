"use client";

import React, { useEffect, useState } from "react";

import Navigation from "@/components/UI/Navigation";
import HeroCanvas from "@/components/react-three/HeroCanvas";
import WorkControls from "@/components/UI/WorkControls";

import { useParams } from "next/navigation";
import Lenis from "lenis";

/* =========================================================
   PROJECT DATA
========================================================= */

const projects = {
  "evergreen-residence": {
    client: "THE BUILDING COMPANY",

    title: "EVERGREEN RESIDENCE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",

      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",

      // Add video 03 here:
      // "https://res.cloudinary.com/.../video03.mp4",
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "woods-project": {
    client: "MORGAN BUILD",

    title: "WOODS PROJECT",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",

      // Add additional Woods Project videos here
      // "https://res.cloudinary.com/.../woods-video-02.mp4",
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "the-dune-house": {
    client: "4LIFE CONSTRUCTIONS",

    title: "THE DUNE HOUSE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",

      // Add additional videos here
      // "https://res.cloudinary.com/.../dunehouse-02.mp4",
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "skatepark-house": {
    client: "MORGAN BUILD",

    title: "SKATEPARK HOUSE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "north-adelaide": {
    client: "KRIVIC",

    title: "NORTH ADELAIDE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "circa-estate": {
    client: "CIRCA",

    title: "ESTATE REDEVELOPMENT",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "ora-projects": {
    client: "ORA PROJECTS",

    title: "VALLEY VIEW RESIDENCE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "nue-built": {
    client: "NUE BUILT",

    title: "MODERN PAVILION",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "arcadia-projects": {
    client: "ARCADIA PROJECTS",

    title: "CLIFFSIDE STUDIO",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "ap-dh": {
    client: "AP.DH",

    title: "HARBOR HOUSE",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "glass-pavilion": {
    client: "KINETIC STUDIO",

    title: "GLASS PAVILION",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "desert-retreat": {
    client: "MODERN ARCH",

    title: "DESERT RETREAT",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },

  "coastal-complex": {
    client: "LUMEN HOMES",

    title: "COASTAL COMPLEX",

    heroVideos: [
      "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",

      // Add additional videos here
    ],

    overview:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1988.",

    servicesLeft: ["Art Direction", "Creative Direction"],

    servicesRight: ["Shorts", "Photography", "Videography"],

    date: "2022",

    gallery: [
      { id: "01", type: "image", src: "/path-to-image-1.jpg" },
      { id: "02", type: "image", src: "/path-to-image-2.jpg" },
      { id: "03", type: "image", src: "/path-to-image-3.jpg" },
      { id: "04", type: "image", src: "/path-to-image-4.jpg" },
      { id: "05", type: "image", src: "/path-to-image-5.jpg" },
      { id: "06", type: "image", src: "/path-to-image-6.jpg" },
      { id: "07", type: "image", src: "/path-to-image-7.jpg" },
      { id: "08", type: "image", src: "/path-to-image-8.jpg" },
      { id: "09", type: "image", src: "/path-to-image-9.jpg" },
      { id: "10", type: "image", src: "/path-to-image-10.jpg" },
      { id: "11", type: "image", src: "/path-to-image-11.jpg" },
      { id: "12", type: "image", src: "/path-to-image-12.jpg" },
      { id: "13", type: "image", src: "/path-to-image-13.jpg" },
      { id: "14", type: "image", src: "/path-to-image-14.jpg" },
      { id: "15", type: "image", src: "/path-to-image-15.jpg" },
      { id: "16", type: "image", src: "/path-to-image-16.jpg" },
    ],
  },
};

/* =========================================================
   PAGE
========================================================= */

export default function CloudhausWorkDetail() {
  const params = useParams();

  const project = projects[params.slug];

  /* =======================================================
     HERO STATE
  ======================================================= */

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [nextVideoIndex, setNextVideoIndex] = useState(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  /*
    Always make sure we have
    a valid video array.
  */

  const heroVideos = project?.heroVideos || [];

  const totalVideos = heroVideos.length;

  const activeSrc =
    heroVideos[currentVideoIndex] || null;

  const nextSrc =
    nextVideoIndex !== null
      ? heroVideos[nextVideoIndex]
      : null;

  /* =======================================================
     NEXT VIDEO
  ======================================================= */

  const handleNext = () => {
    if (isTransitioning) return;

    if (totalVideos <= 1) return;

    const nextIndex =
      currentVideoIndex + 1 >= totalVideos
        ? 0
        : currentVideoIndex + 1;

    setNextVideoIndex(nextIndex);

    setIsTransitioning(true);
  };

  /* =======================================================
     TRANSITION COMPLETE
  ======================================================= */

  const handleTransitionComplete = () => {
    if (nextVideoIndex === null) return;

    setCurrentVideoIndex(nextVideoIndex);

    setNextVideoIndex(null);

    setIsTransitioning(false);
  };

  /* =======================================================
     LENIS
  ======================================================= */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,

      easing: (t) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      smoothWheel: true,

      touchMultiplier: 2,
    });

    let frameId;

    function raf(time) {
      lenis.raf(time);

      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);

      lenis.destroy();
    };
  }, []);

  /* =======================================================
     PROJECT NOT FOUND
  ======================================================= */

  if (!project) {
    return (
      <main
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "
      >
        <p
          className="
            font-geist-mono
            text-sm
            uppercase
            tracking-widest
          "
        >
          Project not found
        </p>
      </main>
    );
  }

  /* =======================================================
     FORMAT COUNTER
  ======================================================= */

  const formattedIndex = String(
    currentVideoIndex + 1
  ).padStart(2, "0");

  const formattedTotal = String(
    totalVideos
  ).padStart(2, "0");

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-dvh
        bg-black
        text-zinc-300
        font-geist-mono
        selection:bg-white
        selection:text-black
      "
    >
      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="
          relative
          w-full
          h-screen
          overflow-hidden
          flex
          flex-col
          justify-between
          p-4
        "
      >
        {/* ===============================================
            NAVIGATION
        =============================================== */}

        <div className="relative z-20">
          <Navigation />
        </div>

        {/* ===============================================
            THREE.JS HERO
        =============================================== */}

        <HeroCanvas
          activeSrc={activeSrc}
          nextSrc={nextSrc}
          isTransitioning={isTransitioning}
          onTransitionComplete={handleTransitionComplete}
        />

        {/* ===============================================
            HERO OVERLAY
        =============================================== */}

        <div
          className="
            absolute
            inset-0
            z-[1]
            bg-black/20
            pointer-events-none
          "
        />

        {/* ===============================================
            CENTER TITLE
        =============================================== */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            justify-center
            my-auto
            text-center
            pointer-events-none
          "
        >
          <span
            className="
              font-sans
              text-3xl
              md:text-5xl
              text-white
              tracking-tight
              drop-shadow-xl
            "
          >
            {project.title}
          </span>
        </div>

        {/* ===============================================
            WORK CONTROLS
        =============================================== */}

        <div
          className="
            relative
            z-20
            w-full
          "
        >
          <WorkControls
            client={project.client}
            title={project.title}
            onNext={handleNext}
            disabled={isTransitioning}
            currentVideo={currentVideoIndex + 1}
            totalVideos={totalVideos}
          />
        </div>
      </section>

      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section
        className="
          mx-auto
          py-20
          p-4
          md:p-8
          grid
          grid-cols-1
          md:grid-cols-12
          gap-12
          text-[11px]
          leading-relaxed
          uppercase
          tracking-wider
          text-zinc-400
          font-geist-mono
        "
      >
        <div
          className="
            md:col-span-7
            space-y-4
          "
        >
          <h2
            className="
              text-white
              font-medium
              md:text-lg
            "
          >
            PROJECT OVERVIEW
          </h2>

          <p
            className="
              max-w-xl
              text-zinc-400
              text-sm
              font-normal
              leading-5
            "
          >
            {project.overview}
          </p>
        </div>

        <div
          className="
            md:col-span-5
            space-y-4
          "
        >
          <h2
            className="
              text-white
              font-medium
              md:text-lg
            "
          >
            WHAT WE DID:
          </h2>

          <ul
            className="
              space-y-1
              text-zinc-400
              text-sm
            "
          >
            {project.servicesRight.map(
              (service, index) => (
                <li key={index}>
                  {service}
                </li>
              )
            )}
          </ul>
        </div>

        <div
          className="
            md:col-span-7
            space-y-2
            pt-6
          "
        >
          <h2
            className="
              text-white
              font-semibold
              tracking-widest
            "
          >
            WHAT WE DID:
          </h2>

          <ul
            className="
              space-y-1
              text-zinc-400
            "
          >
            {project.servicesLeft.map(
              (service, index) => (
                <li key={index}>
                  {service}
                </li>
              )
            )}
          </ul>
        </div>

        <div
          className="
            md:col-span-5
            space-y-2
            pt-6
          "
        >
          <h2
            className="
              text-white
              font-medium
              md:text-lg
            "
          >
            DATE
          </h2>

          <p
            className="
              text-zinc-400
              text-sm
            "
          >
            {project.date}
          </p>
        </div>
      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      <section
        className="
          mx-auto
          px-6
          pb-32
          md:px-12
          pt-20
          md:pt-40
        "
      >
        {/* ROW 1 */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            md:gap-6
            mb-16
            md:mb-24
          "
        >
          {project.gallery
            .slice(0, 4)
            .map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  flex-col
                  space-y-2
                  group
                "
              >
                <span
                  className="
                    text-[10px]
                    text-zinc-300
                    font-geist-mono
                  "
                >
                  #{item.id}
                </span>

                <div
                  className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-zinc-900
                    border
                    border-zinc-800/80
                  "
                >
                  <img
                    src={item.src}
                    alt={`Cloudhaus media ${
                      index + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                      brightness-90
                      group-hover:scale-105
                      group-hover:brightness-100
                      transition-all
                      duration-500
                      ease-out
                    "
                  />
                </div>
              </div>
            ))}
        </div>

        {/* ROW 2 */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            md:gap-6
            mb-16
            md:mb-24
          "
        >
          {[4, 5, 6].map(
            (galleryIndex, index) => (
              <div
                key={galleryIndex}
                className={`
                  flex
                  flex-col
                  space-y-2
                  group
                  ${
                    index === 0
                      ? "col-start-1 md:col-start-1"
                      : index === 1
                        ? "col-start-2 md:col-start-3"
                        : "col-start-1 md:col-start-4"
                  }
                `}
              >
                <span
                  className="
                    text-[10px]
                    text-zinc-300
                    font-geist-mono
                  "
                >
                  #
                  {
                    project.gallery[
                      galleryIndex
                    ].id
                  }
                </span>

                <div
                  className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-zinc-900
                    border
                    border-zinc-800/80
                  "
                >
                  <img
                    src={
                      project.gallery[
                        galleryIndex
                      ].src
                    }
                    alt={`Cloudhaus media ${
                      galleryIndex + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                      brightness-90
                      group-hover:scale-105
                      group-hover:brightness-100
                      transition-all
                      duration-500
                      ease-out
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* ROW 3 */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            md:gap-6
            mb-16
            md:mb-24
          "
        >
          {[7, 8].map(
            (galleryIndex, index) => (
              <div
                key={galleryIndex}
                className={`
                  flex
                  flex-col
                  space-y-2
                  group
                  ${
                    index === 0
                      ? "col-start-1 md:col-start-2"
                      : "col-start-2 md:col-start-3"
                  }
                `}
              >
                <span
                  className="
                    text-[10px]
                    text-zinc-300
                    font-geist-mono
                  "
                >
                  #
                  {
                    project.gallery[
                      galleryIndex
                    ].id
                  }
                </span>

                <div
                  className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-zinc-900
                    border
                    border-zinc-800/80
                  "
                >
                  <img
                    src={
                      project.gallery[
                        galleryIndex
                      ].src
                    }
                    alt={`Cloudhaus media ${
                      galleryIndex + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                      brightness-90
                      group-hover:scale-105
                      group-hover:brightness-100
                      transition-all
                      duration-500
                      ease-out
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* ROW 4 */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            md:gap-6
            mb-16
            md:mb-24
          "
        >
          {[9, 10, 11].map(
            (galleryIndex, index) => (
              <div
                key={galleryIndex}
                className={`
                  flex
                  flex-col
                  space-y-2
                  group
                  ${
                    index === 0
                      ? "col-start-1 md:col-start-1"
                      : index === 1
                        ? "col-start-2 md:col-start-2"
                        : "col-start-1 md:col-start-4"
                  }
                `}
              >
                <span
                  className="
                    text-[10px]
                    text-zinc-300
                    font-geist-mono
                  "
                >
                  #
                  {
                    project.gallery[
                      galleryIndex
                    ].id
                  }
                </span>

                <div
                  className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-zinc-900
                    border
                    border-zinc-800/80
                  "
                >
                  <img
                    src={
                      project.gallery[
                        galleryIndex
                      ].src
                    }
                    alt={`Cloudhaus media ${
                      galleryIndex + 1
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                      brightness-90
                      group-hover:scale-105
                      group-hover:brightness-100
                      transition-all
                      duration-500
                      ease-out
                    "
                  />
                </div>
              </div>
            )
          )}
        </div>

        {/* ROW 5 */}

        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
            md:gap-6
          "
        >
          {project.gallery
            .slice(12, 16)
            .map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  flex-col
                  space-y-2
                  group
                "
              >
                <span
                  className="
                    text-[10px]
                    text-zinc-300
                    font-geist-mono
                  "
                >
                  #{item.id}
                </span>

                <div
                  className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-zinc-900
                    border
                    border-zinc-800/80
                  "
                >
                  <img
                    src={item.src}
                    alt={`Cloudhaus media ${
                      index + 13
                    }`}
                    className="
                      w-full
                      h-full
                      object-cover
                      brightness-90
                      group-hover:scale-105
                      group-hover:brightness-100
                      transition-all
                      duration-500
                      ease-out
                    "
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}