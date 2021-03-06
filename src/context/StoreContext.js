import React, {
  createContext,
  useContext,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@hooks/useLocalStorage'
import * as useULS from '@hooks/useUserLocalStorage'
import { AuthContext } from '@context/AuthContext'

export const StoreContext = createContext({})

export default function StoreContextProvider(props) {
  const {
    state: {
      authentication,
      networkError: tokenNetworkError,
    },
    actions: {
      logout,
      setNetworkError: setTokenNetworkError,
    },
  } = useContext(AuthContext)
  const username = authentication?.user?.username || ''

  /**
   * wrapper for useULS.useUserLocalStorage that applies current username
   * @param {string} key
   * @param {any} initialValue
   * @return {any[]}
   */
  function useUserLocalStorage(key, initialValue) {
    return useULS.useUserLocalStorage(username, key, initialValue)
  }

  const [lastError, setLastError] = useState(null)
  const [owner, setOwner] = useUserLocalStorage('owner', '')
  const [languageId, setLanguageId] = useUserLocalStorage('languageId', '')
  const [showAccountSetup, setShowAccountSetup] = useLocalStorage(
    'showAccountSetup',
    true,
  )
  const [taArticle, setTaArticle] = useState(null)
  const [selectedQuote, setQuote] = useUserLocalStorage('selectedQuote', null)
  // TODO blm: for now we use unfoldingWord for original language bibles
  const [scriptureOwner, setScriptureOwner] = useState('unfoldingWord')
  const [server, setServer] = useState('https://git.door43.org')
  const [appRef, setAppRef] = useUserLocalStorage('appRef', 'master') // default for app
  const [bibleReference, setBibleReference] = useUserLocalStorage('bibleReference', {
    bookId: 'mat',
    chapter: '1',
    verse: '1',
  })

  const [greekRepoUrl, setGreekRepoUrl] = useLocalStorage('greekRepoUrl', null)
  const [hebrewRepoUrl, setHebrewRepoUrl] = useLocalStorage('hebrewRepoUrl', null)
  const [supportedBibles, setSupportedBibles] = useLocalStorage('bibles', [])
  const [currentLayout, setCurrentLayout] = useUserLocalStorage('resourceLayout', null)

  function onReferenceChange(bookId, chapter, verse) {
    setQuote(null)
    setBibleReference(prevState => ({
      ...prevState,
      bookId,
      chapter,
      verse,
    }))
  }

  function updateTaDetails(supportReference) {
    if (supportReference) {
      const path = supportReference?.replace('rc://*/ta/man/', '')
      const split = path.split('/')

      setTaArticle({
        projectId: split.length > 1 ? split[0] : 'translate',
        filePath: `${split[1] || split[0]}/01.md`,
      })
    } else {
      setTaArticle(null)
    }
  }

  const value = {
    state: {
      showAccountSetup,
      scriptureOwner,
      bibleReference,
      selectedQuote,
      languageId,
      taArticle,
      server,
      appRef,
      owner,
      supportedBibles,
      currentLayout,
      useUserLocalStorage,
      loggedInUser: username,
      lastError,
      tokenNetworkError,
      greekRepoUrl,
      hebrewRepoUrl,
    },
    actions: {
      logout,
      onReferenceChange,
      setShowAccountSetup,
      setScriptureOwner,
      setLanguageId,
      setAppRef,
      setServer,
      setQuote,
      setOwner,
      setSupportedBibles,
      setCurrentLayout,
      setLastError,
      setTokenNetworkError,
      updateTaDetails,
      setGreekRepoUrl,
      setHebrewRepoUrl,
    },
  }

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  )
}

StoreContextProvider.propTypes = { children: PropTypes.object }
