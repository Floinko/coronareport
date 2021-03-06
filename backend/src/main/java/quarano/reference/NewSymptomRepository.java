package quarano.reference;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Repository;

@Repository
interface NewSymptomRepository extends PagingAndSortingRepository<NewSymptom, Long> {

	/*
	 * (non-Javadoc)
	 * @see org.springframework.data.repository.CrudRepository#findAll()
	 */
	Streamable<NewSymptom> findAll();

	/*
	 * (non-Javadoc)
	 * @see org.springframework.data.repository.PagingAndSortingRepository#findAll(org.springframework.data.domain.Sort)
	 */
	Streamable<NewSymptom> findAll(Sort sort);

	@Query("SELECT s FROM Symptom s WHERE s.name = :name")
	List<NewSymptom> findAllByName(@Param("name") String name);
}
