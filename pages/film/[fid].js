import { useRouter } from 'next/router'

const FilmDetail = () => {
  const router = useRouter()
  const { fid } = router.query

  return ( 
    <div>film {fid}</div>
   );
}
 
export default FilmDetail;