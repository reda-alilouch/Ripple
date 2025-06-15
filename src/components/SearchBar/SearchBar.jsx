"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { searchonclick } from "@/js/search";
import Icon from "@/components/Icon";
import styles from "./SearchBar.css";
import { useCallback, useEffect, useRef, useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef(null);
  const isInitialMount = useRef(true);

  // Mettre le focus sur l'input au chargement du composant
  useEffect(() => {
    if (inputRef.current) {
      // Délai pour s'assurer que l'animation est terminée
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Mettre à jour la valeur de l'input quand l'URL change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchValue(query);
    if (inputRef.current) {
      inputRef.current.value = query;
      
      // Mettre à jour la recherche uniquement si ce n'est pas le premier rendu
      if (!isInitialMount.current && query) {
        const searchEvent = new CustomEvent("searchUpdate", {
          detail: { query },
        });
        window.dispatchEvent(searchEvent);
      }
    }
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchParams]);

  // Gérer le délai de frappe pour éviter trop de requêtes
  useEffect(() => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (isTyping) {
      typingTimeout.current = setTimeout(() => {
        updateSearch();
        setIsTyping(false);
      }, 300); // Délai de 300ms après la fin de la frappe
    }

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [searchValue, isTyping]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsTyping(true);
  };

  const updateSearch = useCallback(() => {
    // Créer un nouvel objet URLSearchParams avec les paramètres existants
    const params = new URLSearchParams(searchParams);
    
    // Mettre à jour le paramètre 'q' avec la nouvelle valeur
    if (searchValue) {
      params.set('q', searchValue);
    } else {
      params.delete('q');
    }
    
    // Mettre à jour l'URL sans recharger la page
    const queryString = params.toString();
    const newUrl = `/search${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
    
    // Déclencher la recherche
    const searchEvent = new CustomEvent("searchUpdate", {
      detail: { query: searchValue },
    });
    window.dispatchEvent(searchEvent);
  }, [searchParams, router, searchValue]);
  return (
    <div className="relative m-auto w-full h-10 xl:w-4/12">
      <div>
        <input
          ref={inputRef}
          className="hidden absolute right-0 bottom-0 px-2 py-3 w-10/12 h-10 rounded-3xl border transition-colors duration-1000 md:w-8/12 hover:shadow focus:outline-none xl:block xl:w-full dark:bg-slate-900 dark:border-white dark:placeholder-white dark:hover:shadow-customdark"
          id="bar-search"
          type="text"
          placeholder="Recherche"
          aria-label="Search"
          onChange={handleInputChange}
          defaultValue={searchParams.get('q') || ''}
        />
        <div
          className="absolute right-1 bottom-1 p-1 w-8 h-8 text-center rounded-full icon-search-container"
          id="icon-search-container"
          onClick={searchonclick}
        >
          <Icon lib="fa-solid" name="fa-magnifying-glass" className="icon-search" id="icon-search" />
        </div>
      </div>
    </div>
  );
};
export default SearchBar;
