import { FaTrash } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT } from '../mutations/clientMutations';
import { GET_CLIENTS } from '../queries/clientQueries';

export default function ClientRow({ client }) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.id },
        //solution 1 to update delete on front end - refetchQueries
        // refetchQueries: [{ query: GET_CLIENTS }],
        //solution 2 - update cache
        update(cache, { data: { deleteClient } }) {
            const { clients } = cache.readQuery({ query:
            GET_CLIENTS });
            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: clients.filter(client => client.id
                    !== deleteClient.id) },
            });
        }
    });

  return (
    <tr>
        <td>{ client.name }</td>
        <td>{ client.email }</td>
        <td>{ client.phone }</td>
        <td>
            <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                <FaTrash />
            </button>
        </td>
    </tr>
  )
}
